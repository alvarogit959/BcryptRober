import type { User } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { ApiError } from "../../shared/errors/api-error";
import { generateAccessToken } from "../../shared/utils/jwt.util";
import { comparePassword, hashPassword } from "../../shared/utils/password.util";
import type { LoginInput, RegisterInput } from "./auth.schema";

interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  token: string;
}

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const email = data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw ApiError.conflict("El email ya esta registrado");
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email,
      name: data.name ?? null,
      passwordHash,
    },
  });

  const accessToken = generateAccessToken(user.id, user.email);

  return {
    user: toPublicUser(user),
    accessToken,
    token: accessToken,
  };
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const email = data.email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.unauthorized("Credenciales invalidas");
  }

  const passwordMatches = await comparePassword(data.password, user.passwordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized("Credenciales invalidas");
  }

  const accessToken = generateAccessToken(user.id, user.email);

  return {
    user: toPublicUser(user),
    accessToken,
    token: accessToken,
  };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw ApiError.notFound("Usuario no encontrado");
  }
  return toPublicUser(user);
}
