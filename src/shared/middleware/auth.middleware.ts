import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import { verifyAccessToken } from "../utils/jwt.util";

function extractBearerToken(request: Request): string | null {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export function requireAuth(request: Request, _response: Response, next: NextFunction): void {
  const token = extractBearerToken(request);
  if (!token) {
    next(ApiError.unauthorized("Falta token Bearer"));
    return;
  }

  const payload = verifyAccessToken(token);
  request.user = {
    id: payload.sub,
    email: payload.email,
  };
  next();
}
