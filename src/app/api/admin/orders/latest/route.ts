import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Пинг для админки: последний id заказа + число новых. Только для авторизованных.
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const [latest, newCount] = await Promise.all([
    prisma.order.findFirst({ orderBy: { id: "desc" }, select: { id: true } }),
    prisma.order.count({ where: { status: "new" } }),
  ]);
  return NextResponse.json({ latestId: latest?.id ?? 0, newCount });
}
