import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTelegramConfig } from "@/lib/settings";

type Item = { title: string; qty: number; price: number | null; sum: number };
type OrderPayload = {
  name?: string;
  email?: string;
  phone?: string;
  promo?: string;
  total?: number;
  items?: Item[];
};

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  let data: OrderPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const items = data.items ?? [];
  if (!data.phone || items.length === 0) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  // Сохраняем заявку в БД (видна в админке даже если Telegram не настроен).
  const order = await prisma.order.create({
    data: {
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone,
      promo: data.promo ?? "",
      total: Math.round(data.total ?? 0),
      itemsJson: JSON.stringify(items),
    },
  });

  const lines = [
    `🛒 <b>Новый заказ #${order.id} — CarShine</b>`,
    "",
    `👤 <b>Имя:</b> ${esc(data.name || "—")}`,
    `📞 <b>Телефон:</b> ${esc(data.phone || "—")}`,
    `✉️ <b>Email:</b> ${esc(data.email || "—")}`,
    data.promo ? `🎟 <b>Промокод:</b> ${esc(data.promo)}` : "",
    "",
    "<b>Состав заказа:</b>",
    ...items.map(
      (i, n) =>
        `${n + 1}. ${esc(i.title)} — ${i.qty} × ${i.price ? fmt(i.price) : "—"} = ${fmt(i.sum)}`
    ),
    "",
    `💰 <b>Итого: ${fmt(data.total ?? 0)}</b>`,
  ]
    .filter(Boolean)
    .join("\n");

  const { token, chatId } = await getTelegramConfig();

  if (!token || !chatId) {
    // Dev-режим: бота ещё нет — просто логируем, заказ считаем принятым.
    console.log("[ORDER] (Telegram не настроен)\n" + lines);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: "HTML" }),
    });
    if (!tg.ok) {
      console.error("[ORDER] Telegram error", await tg.text());
      // Заказ уже сохранён в БД — считаем принятым, доставим уведомление позже.
      return NextResponse.json({ ok: true, delivered: false, id: order.id });
    }
    await prisma.order.update({ where: { id: order.id }, data: { delivered: true } });
    return NextResponse.json({ ok: true, delivered: true, id: order.id });
  } catch (e) {
    console.error("[ORDER] Telegram exception", e);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
