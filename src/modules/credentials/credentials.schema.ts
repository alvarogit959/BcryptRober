import { z } from "zod";

export const createCredentialSchema = z.object({
  label: z.string().trim().min(3).max(80).optional(),
});

export const verifyCredentialSchema = z.object({
  apiKey: z.string().trim().min(16),
});

export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type VerifyCredentialInput = z.infer<typeof verifyCredentialSchema>;
