import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env";
import { ApiError } from "../errors/api-error";

export function notFoundHandler(_request: Request, _response: Response, next: NextFunction): void {
  next(ApiError.notFound("Ruta no encontrada"));
}

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Datos de entrada invalidos",
      code: "VALIDATION_ERROR",
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      response.status(409).json({
        message: "Ya existe un registro con ese valor unico",
        code: "CONFLICT",
        details: error.meta,
      });
      return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    response.status(400).json({
      message: "Error de validacion en base de datos",
      code: "DATABASE_VALIDATION_ERROR",
    });
    return;
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  response.status(500).json({
    message: "Error interno del servidor",
    code: "INTERNAL_SERVER_ERROR",
  });
}

