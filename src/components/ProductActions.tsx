"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { CartSnapshot } from "@/lib/shop";

export default function ProductActions({ item }: { item: CartSnapshot }) {
  const { add, lines, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = lines.find((l) => l.slug === item.slug)?.qty ?? 0;

  return (
    <div className="space-y-3">
      {inCart > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm">
          <span className="text-fg">
            <span className="text-gold">✓</span> В корзине: <span className="font-semibold">{inCart} шт.</span>
          </span>
          <button onClick={() => setOpen(true)} className="font-medium text-gold hover:underline">
            Открыть корзину →
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-xl border border-border-strong">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-fg-muted hover:text-gold">−</button>
          <span className="min-w-8 text-center font-medium">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3 text-fg-muted hover:text-gold">+</button>
        </div>
        <button
          onClick={() => add(item, qty)}
          className="shine-sweep relative flex-1 overflow-hidden rounded-xl bg-gold px-8 py-3.5 font-semibold text-black transition-colors hover:bg-gold-2"
        >
          {inCart > 0 ? "Добавить ещё" : "Добавить в корзину"}
        </button>
      </div>
    </div>
  );
}
