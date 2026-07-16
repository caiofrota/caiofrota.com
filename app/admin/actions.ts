"use server";

import { clearSession } from "lib/auth";
import { redirect } from "next/navigation";

export async function logoutAdmin(_formData: FormData): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}
