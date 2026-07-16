import "server-only";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";
import { hashPassword, verifyPassword } from "./password";
import { prisma } from "./prisma";

export { hashPassword, verifyPassword } from "./password";

export const adminSessionCookie = "cf_admin_session";

function tokenHash(token: string) {
  return createHash("sha256").update(`${token}:${env.SESSION_SECRET}`).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + env.SESSION_MAX_AGE_DAYS * 86_400_000);
  await prisma.session.create({ data: { userId, tokenHash: tokenHash(token), expiresAt } });
  const store = await cookies();
  store.set(adminSessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getCurrentUser() {
  if (!env.DATABASE_URL) return null;
  const store = await cookies();
  const token = store.get(adminSessionCookie)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/admin/login");
  return user;
}

export async function clearSession() {
  const store = await cookies();
  const token = store.get(adminSessionCookie)?.value;
  if (token && env.DATABASE_URL)
    await prisma.session.updateMany({ where: { tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() } });
  store.delete(adminSessionCookie);
}
