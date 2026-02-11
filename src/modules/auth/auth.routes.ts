import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../../shared/middleware/auth.middleware";
import { login, logout, me, register } from "./auth.controller";

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiadas peticiones de autenticacion. Intentalo de nuevo en unos minutos.",
    code: "TOO_MANY_REQUESTS",
  },
});

const authRouter = Router();
authRouter.use(authLimiter);

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", requireAuth, logout);
authRouter.get("/me", requireAuth, me);

export { authRouter };
