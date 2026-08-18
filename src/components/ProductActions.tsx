"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { CartSnapshot } from "@/lib/shop";

export default function ProductActions({ item }: { item: CartSnapshot }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
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
        Добавить в корзину
      </button>
    </div>
  );
}
