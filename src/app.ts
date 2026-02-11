import cors from "cors";
import express from "express";
import type { RequestHandler } from "express";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { credentialsRouter } from "./modules/credentials/credentials.routes";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middleware/error.middleware";

const app = express();
const corsMiddleware = cors({
  origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
}) as RequestHandler;

app.use(corsMiddleware);
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRouter);
app.use("/credentials", credentialsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
