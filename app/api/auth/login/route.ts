import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "lib/auth";
import { env } from "lib/env";
import { prisma } from "lib/prisma";

export async function POST(request: Request) {
  if (!env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  const form = await request.formData();
  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.redirect(new URL("/admin/login?error=credentials", request.url), 303);
  }
  await createSession(user.id);
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
