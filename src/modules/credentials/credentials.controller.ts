import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../shared/errors/api-error";
import {
  createCredential as createCredentialService,
  listCredentials as listCredentialsService,
  verifyCredential as verifyCredentialService,
} from "./credentials.service";
import { createCredentialSchema, verifyCredentialSchema } from "./credentials.schema";

export async function createCredential(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!request.user) {
      throw ApiError.unauthorized();
    }
    const data = createCredentialSchema.parse(request.body);
    const result = await createCredentialService(request.user.id, data);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listCredentials(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!request.user) {
      throw ApiError.unauthorized();
    }
    const result = await listCredentialsService(request.user.id);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyCredential(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = verifyCredentialSchema.parse(request.body);
    const result = await verifyCredentialService(data);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

