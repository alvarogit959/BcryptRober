import { randomBytes } from "crypto";

const API_KEY_VISIBLE_PREFIX = "ak_";
const API_KEY_PREFIX_LENGTH = 15;

export function generateApiKey(): string {
  const randomPart = randomBytes(32).toString("base64url");
  return `${API_KEY_VISIBLE_PREFIX}${randomPart}`;
}

export function getApiKeyPrefix(apiKey: string): string {
  return apiKey.slice(0, API_KEY_PREFIX_LENGTH);
}

