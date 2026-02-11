import { prisma } from "../../shared/prisma/client";
import { ApiError } from "../../shared/errors/api-error";
import { generateApiKey, getApiKeyPrefix } from "../../shared/utils/crypto.util";
import { compareHash, hashValue } from "../../shared/utils/hash.util";
import type { CreateCredentialInput, VerifyCredentialInput } from "./credentials.schema";

function buildDefaultCredentialLabel(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `key-${timestamp}`;
}

export async function createCredential(userId: string, data: CreateCredentialInput): Promise<{
  id: string;
  label: string;
  prefix: string;
  apiKeyPlainOnce: string;
  createdAt: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) {
    throw ApiError.notFound("Usuario no encontrado");
  }

  const apiKeyPlainOnce = generateApiKey();
  const keyPrefix = getApiKeyPrefix(apiKeyPlainOnce);
  const keyHash = await hashValue(apiKeyPlainOnce);
  const label = data.label ?? buildDefaultCredentialLabel();

  const credential = await prisma.apiCredential.create({
    data: {
      userId,
      label,
      keyPrefix,
      keyHash,
    },
  });

  return {
    id: credential.id,
    label: credential.label,
    prefix: credential.keyPrefix,
    apiKeyPlainOnce,
    createdAt: credential.createdAt,
  };
}

export async function listCredentials(userId: string): Promise<
  Array<{
    id: string;
    label: string;
    prefix: string;
    lastUsedAt: Date | null;
    createdAt: Date;
  }>
> {
  const credentials = await prisma.apiCredential.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      keyPrefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return credentials.map((credential) => ({
    id: credential.id,
    label: credential.label,
    prefix: credential.keyPrefix,
    lastUsedAt: credential.lastUsedAt,
    createdAt: credential.createdAt,
  }));
}

export async function verifyCredential(data: VerifyCredentialInput): Promise<{
  valid: boolean;
  credentialId?: string;
}> {
  const keyPrefix = getApiKeyPrefix(data.apiKey);
  const candidates = await prisma.apiCredential.findMany({
    where: { keyPrefix },
    select: { id: true, keyHash: true },
  });

  for (const candidate of candidates) {
    const isMatch = await compareHash(data.apiKey, candidate.keyHash);
    if (isMatch) {
      await prisma.apiCredential.update({
        where: { id: candidate.id },
        data: { lastUsedAt: new Date() },
      });
      return {
        valid: true,
        credentialId: candidate.id,
      };
    }
  }

  return { valid: false };
}
