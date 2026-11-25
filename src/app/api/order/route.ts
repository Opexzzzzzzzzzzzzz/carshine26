import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Item = { title: string; qty: number; price: number | null; sum: number };
type OrderPayload = {
  name?: string;
  email?: string;
  phone?: string;
  promo?: string;
  total?: number;
  items?: Item[];
};

// Заявка с сайта сохраняется только в нашей БД (сервер в РФ) и видна в админке.
// Никуда больше данные покупателя не отправляются (без трансграничной передачи).
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

  return NextResponse.json({ ok: true, id: order.id });
}
