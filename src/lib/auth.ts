import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "cs_admin";

function expectedToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  return createHash("sha256").update("carshine::" + pw).digest("hex");
}

export function checkPassword(pw: string): boolean {
  const real = process.env.ADMIN_PASSWORD || "";
  return !!real && pw === real;
}

export function sessionToken(): string {
  return expectedToken();
}

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === expectedToken();
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}
