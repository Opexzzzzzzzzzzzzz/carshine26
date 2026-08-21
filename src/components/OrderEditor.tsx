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

// Поля внутри строк состава — чуть светлее карточки, с фокус-подсветкой.
const lineFieldCls =
  "w-full rounded-lg border border-border-strong/70 bg-surface-2 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-fg-dim focus:border-gold focus:ring-1 focus:ring-gold/25";

function Chevron({ dir }: { dir: "up" | "down" }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path
        d={dir === "up" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

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
            <div
              key={i}
              className="group flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface/40 p-3 transition-colors hover:border-border-strong sm:flex-nowrap"
            >
              <label className="min-w-0 flex-1">
                <span className="mb-1.5 block text-[11px] font-medium text-fg-dim">Товар</span>
                <input
                  value={it.title}
                  list="order-catalog"
                  autoComplete="off"
                  onChange={(e) => setField(i, { title: e.target.value })}
                  className={lineFieldCls}
                />
              </label>

              <div className="w-28 shrink-0">
                <span className="mb-1.5 block text-[11px] font-medium text-fg-dim">Кол-во</span>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-border-strong/70 bg-surface-2 transition-colors focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/25">
                  <input
                    inputMode="numeric"
                    value={it.qty === 0 ? "" : it.qty}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setField(i, { qty: v === "" ? 0 : parseInt(v, 10) });
                    }}
                    onBlur={() => { if (it.qty < 1) setField(i, { qty: 1 }); }}
                    className="w-full min-w-0 bg-transparent py-2.5 pl-3 text-center text-sm tabular-nums outline-none"
                  />
                  <div className="flex w-7 shrink-0 flex-col border-l border-border-strong/70">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Увеличить количество"
                      onClick={() => setField(i, { qty: it.qty + 1 })}
                      className="flex flex-1 items-center justify-center text-fg-muted transition-colors hover:bg-gold/15 hover:text-gold"
                    >
                      <Chevron dir="up" />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label="Уменьшить количество"
                      onClick={() => setField(i, { qty: Math.max(1, it.qty - 1) })}
                      className="flex flex-1 items-center justify-center border-t border-border-strong/70 text-fg-muted transition-colors hover:bg-gold/15 hover:text-gold"
                    >
                      <Chevron dir="down" />
                    </button>
                  </div>
                </div>
              </div>

              <label className="w-32 shrink-0">
                <span className="mb-1.5 block text-[11px] font-medium text-fg-dim">Цена</span>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-border-strong/70 bg-surface-2 transition-colors focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/25">
                  <input
                    inputMode="numeric"
                    value={it.price ?? ""}
                    placeholder="—"
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setField(i, { price: v === "" ? null : Math.max(0, Math.round(Number(v) || 0)) });
                    }}
                    className="w-full min-w-0 bg-transparent py-2.5 pl-3 text-right text-sm tabular-nums outline-none placeholder:text-fg-dim"
                  />
                  <span className="flex items-center pl-1 pr-3 text-sm text-fg-dim">₽</span>
                </div>
              </label>

              <div className="w-28 shrink-0">
                <span className="mb-1.5 block text-right text-[11px] font-medium text-fg-dim">Сумма</span>
                <div className="py-2.5 text-right text-sm font-semibold tabular-nums text-gold">
                  {formatPrice(it.sum)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAt(i)}
                title="Убрать позицию"
                aria-label="Убрать позицию"
                className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-fg-dim transition-colors hover:border-danger/50 hover:bg-danger/10 hover:text-danger"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3.5 py-2 text-sm text-fg-muted transition-colors hover:border-gold hover:text-gold"
        >
          <span className="text-base leading-none">+</span> Добавить позицию
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
