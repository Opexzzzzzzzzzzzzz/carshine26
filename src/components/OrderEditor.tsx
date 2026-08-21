"use client";

import { useMemo, useState } from "react";
import { updateOrder } from "@/app/admin/actions";
import { formatPrice } from "@/lib/shop";

type Item = { title: string; qty: number; price: number | null; sum: number };
type CatalogItem = { title: string; price: number | null };
type Order = {
  id: number;
  name: string;
  email: string;
  phone: string;
  promo: string;
  status: string;
  items: Item[];
};

const inputCls =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold";

export default function OrderEditor({
  order,
  catalog = [],
}: {
  order: Order;
  catalog?: CatalogItem[];
}) {
  const [items, setItems] = useState<Item[]>(order.items);

  // Карта «точное название → цена» для автоподстановки цены при выборе товара.
  const priceByTitle = useMemo(() => {
    const m = new Map<string, number | null>();
    for (const c of catalog) m.set(c.title, c.price);
    return m;
  }, [catalog]);

  const setField = (i: number, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        const next = { ...it, ...patch };
        // При точном совпадении названия с товаром из каталога — подставляем цену.
        if ("title" in patch && priceByTitle.has(next.title)) {
          next.price = priceByTitle.get(next.title) ?? null;
        }
        next.sum = (next.price ?? 0) * next.qty;
        return next;
      })
    );

  const removeAt = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const addRow = () =>
    setItems((prev) => [...prev, { title: "", qty: 1, price: 0, sum: 0 }]);

  const clean = items
    .map((it) => {
      // Пустое кол-во (после очистки поля) при сохранении считаем за 1.
      const qty = it.qty < 1 ? 1 : it.qty;
      return { ...it, title: it.title.trim(), qty, sum: (it.price ?? 0) * qty };
    })
    .filter((it) => it.title);
  const total = clean.reduce((s, it) => s + it.sum, 0);

  return (
    <form action={updateOrder} className="surface-card space-y-5 rounded-2xl p-6">
      <input type="hidden" name="id" value={order.id} />
      <input type="hidden" name="items" value={JSON.stringify(clean)} />

      {priceByTitle.size > 0 && (
        <datalist id="order-catalog">
          {Array.from(priceByTitle.keys()).map((t) => <option key={t} value={t} />)}
        </datalist>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Имя</span>
          <input name="name" defaultValue={order.name} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Телефон</span>
          <input name="phone" defaultValue={order.phone} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Email</span>
          <input name="email" defaultValue={order.email} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Промокод</span>
          <input name="promo" defaultValue={order.promo} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Статус</span>
          <select name="status" defaultValue={order.status} className={inputCls}>
            <option value="new">Новый</option>
            <option value="processing">В работе</option>
            <option value="done">Выполнен</option>
            <option value="canceled">Отменён</option>
          </select>
        </label>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-dim">
          Состав заказа
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2 rounded-xl border border-border p-3 sm:flex-nowrap">
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-[11px] text-fg-dim">Товар</span>
                <input
                  value={it.title}
                  list="order-catalog"
                  autoComplete="off"
                  onChange={(e) => setField(i, { title: e.target.value })}
                  className={inputCls}
                />
              </label>
              <div className="w-24 shrink-0">
                <span className="mb-1 block text-[11px] text-fg-dim">Кол-во</span>
                <div className="flex items-stretch">
                  <input
                    inputMode="numeric"
                    value={it.qty === 0 ? "" : it.qty}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setField(i, { qty: v === "" ? 0 : parseInt(v, 10) });
                    }}
                    onBlur={() => { if (it.qty < 1) setField(i, { qty: 1 }); }}
                    className="w-full rounded-l-lg border border-border-strong bg-bg px-2 py-2.5 text-center text-sm outline-none focus:border-gold"
                  />
                  <div className="flex flex-col">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Увеличить количество"
                      onClick={() => setField(i, { qty: it.qty + 1 })}
                      className="flex h-1/2 w-7 items-center justify-center rounded-tr-lg border-y border-r border-border-strong text-[9px] text-fg-muted hover:bg-surface-2 hover:text-gold"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Уменьшить количество"
                      onClick={() => setField(i, { qty: Math.max(1, it.qty - 1) })}
                      className="flex h-1/2 w-7 items-center justify-center rounded-br-lg border-b border-r border-border-strong text-[9px] text-fg-muted hover:bg-surface-2 hover:text-gold"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
              <label className="w-28 shrink-0">
                <span className="mb-1 block text-[11px] text-fg-dim">Цена, ₽</span>
                <input
                  inputMode="numeric"
                  value={it.price ?? ""}
                  placeholder="—"
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    setField(i, { price: v === "" ? null : Math.max(0, Math.round(Number(v) || 0)) });
                  }}
                  className={inputCls}
                />
              </label>
              <div className="w-28 shrink-0 pb-2.5 text-right text-sm text-fg-muted">
                {formatPrice(it.sum)}
              </div>
              <button
                type="button"
                onClick={() => removeAt(i)}
                title="Убрать позицию"
                className="shrink-0 rounded-lg border border-danger/40 px-2.5 py-2 text-xs text-danger hover:bg-danger/10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 rounded-lg border border-border-strong px-3 py-2 text-sm text-fg-muted hover:border-gold hover:text-gold"
        >
          + добавить позицию
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-fg-muted">Итого (пересчитывается автоматически)</span>
        <span className="font-display text-xl font-bold">{formatPrice(total)}</span>
      </div>

      <button className="rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">
        Сохранить изменения
      </button>
    </form>
  );
}
