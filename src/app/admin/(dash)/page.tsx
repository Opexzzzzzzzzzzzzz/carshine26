import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/shop";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [products, inStock, orders, ordersToday, newOrders, recent, revenueAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { inStock: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { status: "new" } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats: [string, string, string?][] = [
    ["Товаров", products.toLocaleString("ru-RU"), `${inStock} в наличии`],
    ["Заказов всего", orders.toLocaleString("ru-RU"), `${ordersToday} сегодня`],
    ["Новых заявок", newOrders.toLocaleString("ru-RU"), "требуют обработки"],
    ["Сумма заказов", formatPrice(revenue)],
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, val, sub]) => (
          <div key={label} className="surface-card rounded-2xl p-5">
            <div className="text-xs text-fg-dim">{label}</div>
            <div className="mt-2 font-display text-2xl font-bold">{val}</div>
            {sub && <div className="mt-1 text-xs text-fg-muted">{sub}</div>}
          </div>
        ))}
      </div>

      <div className="surface-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-semibold">Последние заказы</h3>
          <Link href="/admin/orders" className="text-sm text-gold hover:underline">Все заказы →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">Заказов пока нет</div>
        ) : (
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-fg-dim">
                <tr className="border-b border-border">
                  <th className="p-4 font-medium">№</th>
                  <th className="p-4 font-medium">Клиент</th>
                  <th className="p-4 font-medium">Телефон</th>
                  <th className="p-4 font-medium">Сумма</th>
                  <th className="p-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-border/60">
                    <td className="p-4 text-fg-muted">#{o.id}</td>
                    <td className="p-4">{o.name || "—"}</td>
                    <td className="p-4 text-fg-muted">{o.phone}</td>
                    <td className="p-4 font-medium">{formatPrice(o.total)}</td>
                    <td className="p-4"><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    new: ["Новый", "text-accent bg-accent/10 ring-accent/30"],
    processing: ["В работе", "text-gold bg-gold/10 ring-gold/30"],
    done: ["Выполнен", "text-success bg-success/10 ring-success/30"],
    canceled: ["Отменён", "text-danger bg-danger/10 ring-danger/30"],
  };
  const [label, cls] = map[status] ?? map.new;
  return <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${cls}`}>{label}</span>;
}
