import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../shared/errors/api-error";
import {
  login as loginService,
  getCurrentUser,
  register as registerService,
} from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";

export async function register(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const data = registerSchema.parse(request.body);
    const result = await registerService(data);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const data = loginSchema.parse(request.body);
    const result = await loginService(data);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    if (!request.user) {
      throw ApiError.unauthorized();
    }
    response.status(200).json({
      message: "Logout correcto. El cliente debe eliminar el token local.",
    });
  } catch (error) {
    next(error);
  }
}

export async function me(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    if (!request.user) {
      throw ApiError.unauthorized();
    }

    const user = await getCurrentUser(request.user.id);
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
