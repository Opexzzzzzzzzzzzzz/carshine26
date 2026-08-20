import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import OrderEditor from "@/components/OrderEditor";

export const dynamic = "force-dynamic";

type Item = { title: string; qty: number; price: number | null; sum: number };

export default async function EditOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const o = await prisma.order.findUnique({ where: { id: Number(id) } });
  if (!o) notFound();

  let items: Item[] = [];
  try {
    const parsed = JSON.parse(o.itemsJson);
    if (Array.isArray(parsed)) items = parsed;
  } catch {}

  return (
    <div className="max-w-3xl space-y-5">
      <Link href="/admin/orders" className="text-sm text-fg-muted hover:text-gold">← К заказам</Link>
      <div>
        <h1 className="font-display text-2xl font-bold">Редактирование заказа #{o.id}</h1>
        <p className="mt-1 text-sm text-fg-dim">
          Создан {new Date(o.createdAt).toLocaleString("ru-RU")}
        </p>
      </div>

      <OrderEditor
        order={{
          id: o.id,
          name: o.name,
          email: o.email,
          phone: o.phone,
          promo: o.promo,
          status: o.status,
          items,
        }}
      />
    </div>
  );
}
