import { z } from "zod";

const optionalString = z.preprocess((value) => (value === "" ? undefined : value), z.string().min(1).optional());

const schema = z.object({
  DATABASE_URL: optionalString,
  SESSION_SECRET: z.string().min(24).default("development-session-secret-change-me"),
  SESSION_MAX_AGE_DAYS: z.coerce.number().int().positive().default(30),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  LOGIN_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(900),
  R2_ACCOUNT_ID: optionalString,
  R2_ACCESS_KEY_ID: optionalString,
  R2_SECRET_ACCESS_KEY: optionalString,
  R2_BUCKET: optionalString,
  R2_PUBLIC_BASE_URL: optionalString,
});

export const env = schema.parse(process.env);
