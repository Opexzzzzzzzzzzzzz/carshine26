"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const pw = String(formData.get("password") || "");
  if (!checkPassword(pw)) redirect("/admin/login?e=1");
  const c = await cookies();
  c.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/admin");
}

export async function logout() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
