import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../../shared/middleware/auth.middleware";
import {
  createCredential,
  listCredentials,
  verifyCredential,
} from "./credentials.controller";

const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiadas verificaciones. Intentalo de nuevo en unos minutos.",
    code: "TOO_MANY_REQUESTS",
  },
});

const credentialsRouter = Router();

credentialsRouter.post("/", requireAuth, createCredential);
credentialsRouter.get("/", requireAuth, listCredentials);
credentialsRouter.post("/verify", verifyLimiter, verifyCredential);

export { credentialsRouter };
