"use client";

import { useState } from "react";
import Link from "next/link";
import { products, formatPrice } from "@/lib/catalog";

const orders = [
  { id: "1043", name: "Алексей М.", sum: 3840, status: "Новый", city: "Ставрополь" },
  { id: "1042", name: "Студия «Глянец»", sum: 12250, status: "Собран", city: "Краснодар" },
  { id: "1041", name: "Ирина К.", sum: 1580, status: "Доставлен", city: "Ростов" },
  { id: "1040", name: "Detailing Pro", sum: 41900, status: "Оплачен", city: "Москва" },
];

const statusColor: Record<string, string> = {
  Новый: "text-accent bg-accent/10 ring-accent/30",
  Собран: "text-gold bg-gold/10 ring-gold/30",
  Оплачен: "text-gold bg-gold/10 ring-gold/30",
  Доставлен: "text-success bg-success/10 ring-success/30",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"dash" | "products" | "orders">("dash");
  const [stock, setStock] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((p) => [p.slug, p.inStock]))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs text-fg-dim">Прототип · так владелец управляет магазином</div>
          <h1 className="font-display text-3xl font-bold">Панель управления</h1>
        </div>
        <Link href="/" className="text-sm text-fg-muted hover:text-gold">
          ← На сайт
        </Link>
      </div>

      {/* Табы */}
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-surface p-1 text-sm">
        {[
          ["dash", "Сводка"],
          ["products", "Товары"],
          ["orders", "Заказы"],
        ].map(([v, t]) => (
          <button
            key={v}
            onClick={() => setTab(v as typeof tab)}
            className={`rounded-lg px-4 py-2 transition-colors ${
              tab === v ? "bg-gold text-black" : "text-fg-muted hover:text-fg"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "dash" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Выручка за месяц", "284 500 ₽", "+18%"],
              ["Заказов", "63", "+9%"],
              ["Средний чек", "4 516 ₽", "+4%"],
              ["Товаров в наличии", `${Object.values(stock).filter(Boolean).length}`, ""],
            ].map(([label, val, delta]) => (
              <div key={label} className="surface-card rounded-2xl p-5">
                <div className="text-xs text-fg-dim">{label}</div>
                <div className="mt-2 font-display text-2xl font-bold">{val}</div>
                {delta && (
                  <div className="mt-1 text-xs text-success">{delta} к прошлому месяцу</div>
                )}
              </div>
            ))}
          </div>

          <div className="surface-card rounded-2xl p-5">
            <h3 className="mb-4 font-semibold">Продажи за неделю</h3>
            <div className="flex h-40 items-end gap-3">
              {[40, 62, 48, 80, 55, 92, 70].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-gold-deep to-gold"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-fg-dim">
                    {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="surface-card overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-semibold">Товары ({products.length})</h3>
            <button className="rounded-lg bg-gold px-3 py-1.5 text-sm font-semibold text-black hover:bg-gold-2">
              + Добавить товар
            </button>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-fg-dim">
                <tr className="border-b border-border">
                  <th className="p-4 font-medium">Название</th>
                  <th className="p-4 font-medium">Бренд</th>
                  <th className="p-4 font-medium">Цена</th>
                  <th className="p-4 font-medium">В наличии</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.slug}
                    className="border-b border-border/60 transition-colors hover:bg-surface-2"
                  >
                    <td className="max-w-xs p-4">
                      <div className="truncate">{p.title}</div>
                    </td>
                    <td className="p-4 text-fg-muted">{p.brand}</td>
                    <td className="p-4 font-medium">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          setStock((s) => ({ ...s, [p.slug]: !s[p.slug] }))
                        }
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          stock[p.slug] ? "bg-success" : "bg-border-strong"
                        }`}
                        aria-label="В наличии"
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            stock[p.slug] ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="surface-card overflow-hidden rounded-2xl">
          <div className="border-b border-border p-4">
            <h3 className="font-semibold">Последние заказы</h3>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-fg-dim">
                <tr className="border-b border-border">
                  <th className="p-4 font-medium">№</th>
                  <th className="p-4 font-medium">Клиент</th>
                  <th className="p-4 font-medium">Город</th>
                  <th className="p-4 font-medium">Сумма</th>
                  <th className="p-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/60 transition-colors hover:bg-surface-2"
                  >
                    <td className="p-4 text-fg-muted">#{o.id}</td>
                    <td className="p-4">{o.name}</td>
                    <td className="p-4 text-fg-muted">{o.city}</td>
                    <td className="p-4 font-medium">{formatPrice(o.sum)}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ring-1 ${statusColor[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
