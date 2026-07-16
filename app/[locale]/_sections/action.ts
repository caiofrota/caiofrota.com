"use server";
import { createHash } from "crypto";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { z } from "zod";
import { createContactFormToken as createSignedFormToken, verifyContactFormToken } from "lib/contact-form-token";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimits = new Map<string, number[]>();
const usedFormTokens = new Map<string, number>();

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .refine((value) => !/[\r\n]/.test(value)),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5_000),
  formToken: z.string().min(20).max(2_048),
  website: z.string().max(200).optional().default(""),
});

export type ContactErrorCode = "invalid-fields" | "invalid-form" | "rate-limited" | "configuration" | "send-failed";

export type SendEmailResult = { ok: true } | { ok: false; error: ContactErrorCode };

export type ContactRequest = z.input<typeof contactSchema>;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function consumeRateLimit(key: string) {
  const now = Date.now();
  const recentAttempts = (rateLimits.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recentAttempts.length >= RATE_LIMIT_MAX) {
    rateLimits.set(key, recentAttempts);
    return false;
  }

  recentAttempts.push(now);
  rateLimits.set(key, recentAttempts);
  return true;
}

function consumeFormToken(nonce: string, expiresAt: number) {
  const now = Date.now();
  for (const [usedNonce, expiry] of usedFormTokens) {
    if (expiry < now) usedFormTokens.delete(usedNonce);
  }
  if (usedFormTokens.has(nonce)) return false;
  usedFormTokens.set(nonce, expiresAt);
  return true;
}

function looksLikeSpam(message: string) {
  const linkCount = message.match(/(?:https?:\/\/|www\.)/gi)?.length ?? 0;
  return linkCount > 3 || /(.)\1{14,}/u.test(message);
}

async function getRateLimitKey(email: string) {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || requestHeaders.get("x-real-ip")?.trim();
  const fallback = createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 24);
  return ip ? `ip:${ip}` : `email:${fallback}`;
}

export async function createContactFormToken(): Promise<string> {
  return createSignedFormToken();
}

export async function sendEmail(request: ContactRequest): Promise<SendEmailResult> {
  if (!request || typeof request !== "object") return { ok: false, error: "invalid-fields" };
  if (typeof request.website === "string" && request.website.trim()) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(request);
  if (!parsed.success) return { ok: false, error: "invalid-fields" };

  const { name, email, message, formToken } = parsed.data;
  const verifiedToken = verifyContactFormToken(formToken);
  if (!verifiedToken) return { ok: false, error: "invalid-form" };

  const port = Number(process.env.SMTP_PORT);
  if (
    !process.env.SMTP_HOST ||
    !Number.isInteger(port) ||
    port <= 0 ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_MAIL_TO
  ) {
    return { ok: false, error: "configuration" };
  }

  const rateLimitKey = await getRateLimitKey(email);
  if (!consumeRateLimit(rateLimitKey)) return { ok: false, error: "rate-limited" };
  if (!consumeFormToken(verifiedToken.nonce, verifiedToken.expiresAt)) {
    return { ok: false, error: "invalid-form" };
  }
  if (looksLikeSpam(message)) return { ok: true };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `Website <website@caiofrota.com>`,
      replyTo: { name, address: email },
      to: process.env.SMTP_MAIL_TO,
      subject: `Uma nova mensagem de: ${name}`,
      text: message,
      html: `<p>${escapeHtml(message).replace(/\r?\n/g, "<br />")}</p><p>De: ${escapeHtml(name)} (${escapeHtml(email)})</p>`,
    });
    return { ok: true };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { ok: false, error: "send-failed" };
  }
}
