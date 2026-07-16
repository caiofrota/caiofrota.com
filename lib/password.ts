import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash || !/^[a-f0-9]{128}$/i.test(hash)) return false;

  const candidate = scryptSync(password, salt, 64);
  const storedHash = Buffer.from(hash, "hex");
  return candidate.length === storedHash.length && timingSafeEqual(candidate, storedHash);
}
