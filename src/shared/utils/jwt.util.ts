import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { ApiError } from "../errors/api-error";
import { JwtPayloadBase } from "../types/auth.types";

const JWT_ISSUER = "ejemplo-cifrado";

function signToken(
  payload: JwtPayloadBase,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string {
  const options: SignOptions = {
    expiresIn,
    issuer: JWT_ISSUER,
  };

  return jwt.sign(payload, secret, options);
}

function verifyToken(token: string, secret: string): JwtPayloadBase {
  try {
    const payload = jwt.verify(token, secret, {
      issuer: JWT_ISSUER,
    }) as JwtPayloadBase;

    if (
      !payload ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string"
    ) {
      throw ApiError.unauthorized("Token invalido");
    }

    return payload;
  } catch {
    throw ApiError.unauthorized("Token invalido o expirado");
  }
}

export function generateAccessToken(userId: string, email: string): string {
  return signToken(
    { sub: userId, email },
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  );
}

export function verifyAccessToken(token: string): JwtPayloadBase {
  return verifyToken(token, env.JWT_ACCESS_SECRET);
}
