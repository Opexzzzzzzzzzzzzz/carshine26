"use client";

import { useState } from "react";
import { computeDiscount, formatPrice } from "@/lib/shop";

const inputCls =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold disabled:opacity-40";

const toNum = (s: string) => {
  const t = s.replace(/\s/g, "").replace(",", ".");
  if (!t) return null;
  const n = Math.round(Number(t));
  return Number.isFinite(n) ? n : null;
};

// Цена + скидка (процент или сумма) + галочка «Распродажа».
// Отдаёт поля формы: price, discountType, discountValue, onSale.
export default function PricingFields({
  price: price0 = null,
  discountType: type0 = "",
  discountValue: value0 = 0,
  onSale: sale0 = false,
}: {
  price?: number | null;
  discountType?: string;
  discountValue?: number;
  onSale?: boolean;
}) {
  const [price, setPrice] = useState(price0 == null ? "" : String(price0));
  const [type, setType] = useState(type0);
  const [value, setValue] = useState(value0 ? String(value0) : "");
  const [onSale, setOnSale] = useState(sale0);

  const priceNum = toNum(price);
  const valueNum = toNum(value) ?? 0;
  const d = computeDiscount(priceNum, type, valueNum);

  let error = "";
  if (type && !d.valid) {
    if (priceNum == null || priceNum <= 0) error = "Сначала укажите цену товара";
    else if (type === "percent") error = "Процент скидки — от 1 до 99";
    else error = "Сумма скидки должна быть больше 0 и меньше цены";
  }

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Цена, ₽ (пусто = по запросу)</span>
          <input
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Скидка</span>
          <select
            name="discountType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputCls}
          >
            <option value="">Без скидки</option>
            <option value="percent">Процент, %</option>
            <option value="amount">Сумма, ₽</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">
            Размер скидки{type === "percent" ? ", %" : type === "amount" ? ", ₽" : ""}
          </span>
          <input
            name="discountValue"
            value={type ? value : ""}
            onChange={(e) => setValue(e.target.value)}
            disabled={!type}
            inputMode="numeric"
            placeholder={type === "percent" ? "например, 15" : type === "amount" ? "например, 500" : "—"}
            className={inputCls}
          />
        </label>
      </div>

      {d.valid && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-fg-muted">Цена для покупателя:</span>
          <span className="font-semibold text-danger">{formatPrice(d.final)}</span>
          <span className="text-fg-dim line-through">{formatPrice(priceNum)}</span>
          <span className="rounded-md bg-danger px-1.5 py-0.5 text-xs font-bold text-white">{d.label}</span>
        </div>
      )}
      {error && <div className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</div>}

      <label
        className={`flex items-start gap-2.5 text-sm ${d.valid ? "cursor-pointer text-fg" : "cursor-not-allowed text-fg-dim"}`}
      >
        <input
          type="checkbox"
          name="onSale"
          checked={d.valid && onSale}
          disabled={!d.valid}
          onChange={(e) => setOnSale(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--gold)]"
        />
        <span>
          Распродажа
          <span className="block text-xs text-fg-dim">
            {d.valid
              ? "Товар попадёт в раздел «Распродажа» и в карусель на главной"
              : "Доступно только при активной скидке"}
          </span>
        </span>
      </label>
    </div>
  );
}
