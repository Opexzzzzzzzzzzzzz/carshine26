import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/shop";
import { setOrderStatus } from "../../actions";

export const dynamic = "force-dynamic";

type Item = { title: string; qty: number; price: number | null; sum: number };

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Заказы</h1>
      {orders.length === 0 ? (
        <div className="surface-card rounded-2xl p-10 text-center text-fg-muted">Заказов пока нет</div>
      ) : (
        orders.map((o) => {
          let items: Item[] = [];
          try { items = JSON.parse(o.itemsJson); } catch {}
          return (
            <div key={o.id} className="surface-card rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-bold">Заказ #{o.id}</span>
                    <span className="text-xs text-fg-dim">
                      {new Date(o.createdAt).toLocaleString("ru-RU")}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-fg-muted">
                    {o.name || "—"} · <a href={`tel:${o.phone}`} className="hover:text-gold">{o.phone}</a>
                    {o.email ? ` · ${o.email}` : ""}
                    {o.promo ? ` · промокод: ${o.promo}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold">{formatPrice(o.total)}</span>
                  <form action={setOrderStatus} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="rounded-lg border border-border-strong bg-surface px-2 py-1.5 text-sm outline-none focus:border-gold"
                    >
                      <option value="new">Новый</option>
                      <option value="processing">В работе</option>
                      <option value="done">Выполнен</option>
                      <option value="canceled">Отменён</option>
                    </select>
                    <button className="rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs text-fg-muted hover:text-gold">OK</button>
                  </form>
                </div>
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <ul className="space-y-1 text-sm text-fg-muted">
                  {items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>{it.title}</span>
                      <span className="shrink-0">{it.qty} × {formatPrice(it.price)} = {formatPrice(it.sum)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
