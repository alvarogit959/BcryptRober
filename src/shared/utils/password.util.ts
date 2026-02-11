import { ApiError } from "../errors/api-error";
import { compareHash, hashValue } from "./hash.util";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

export function assertPasswordPolicy(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    throw ApiError.badRequest(
      `La contrasena debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres`,
    );
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSymbol) {
    throw ApiError.badRequest(
      "La contrasena debe incluir al menos una minuscula, una mayuscula, un numero y un simbolo",
    );
  }
}

export async function hashPassword(password: string): Promise<string> {
  assertPasswordPolicy(password);
  return hashValue(password);
}

export async function comparePassword(password: string, passwordHash: string): Promise<boolean> {
  return compareHash(password, passwordHash);
}

