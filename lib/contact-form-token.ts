import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { env } from "./env";

const FORM_TOKEN_TTL_MS = 4 * 60 * 60 * 1000;
const MINIMUM_FILL_TIME_MS = 2_000;

type FormTokenPayload = {
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

export type VerifiedContactFormToken = {
  nonce: string;
  expiresAt: number;
};

function sign(value: string) {
  return createHmac("sha256", env.SESSION_SECRET).update(`contact-form:${value}`).digest();
}

export function createContactFormToken(): string {
  const issuedAt = Date.now();
  const payload: FormTokenPayload = {
    issuedAt,
    expiresAt: issuedAt + FORM_TOKEN_TTL_MS,
    nonce: randomBytes(16).toString("hex"),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload).toString("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyContactFormToken(token: string): VerifiedContactFormToken | null {
  const [encodedPayload, encodedSignature, extraPart] = token.split(".");
  if (!encodedPayload || !encodedSignature || extraPart) return null;

  let receivedSignature: Buffer;
  try {
    receivedSignature = Buffer.from(encodedSignature, "base64url");
  } catch {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  if (receivedSignature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(receivedSignature, expectedSignature)) return null;

  let payload: FormTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as FormTokenPayload;
  } catch {
    return null;
  }

  const now = Date.now();
  if (
    !payload ||
    typeof payload !== "object" ||
    !Number.isFinite(payload.issuedAt) ||
    !Number.isFinite(payload.expiresAt) ||
    typeof payload.nonce !== "string" ||
    !/^[a-f0-9]{32}$/.test(payload.nonce) ||
    payload.expiresAt - payload.issuedAt !== FORM_TOKEN_TTL_MS ||
    payload.issuedAt > now + 30_000 ||
    now - payload.issuedAt < MINIMUM_FILL_TIME_MS ||
    now > payload.expiresAt
  ) {
    return null;
  }

  return { nonce: payload.nonce, expiresAt: payload.expiresAt };
}
