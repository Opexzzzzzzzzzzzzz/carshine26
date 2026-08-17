"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import type { CartSnapshot } from "@/lib/shop";

export default function ProductActions({ item }: { item: CartSnapshot }) {
  const { add } = useCart();
  const fav = useFavorites();
  const [qty, setQty] = useState(1);
  const liked = fav.has(item.slug);

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
      <button
        onClick={() => fav.toggle(item)}
        className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl border transition-colors ${
          liked ? "border-gold bg-gold/10 text-gold" : "border-border-strong text-fg-muted hover:border-gold hover:text-gold"
        }`}
        aria-label="В избранное"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
          <path d="M12 21s-7.5-4.6-10-9.2C.5 8.6 2 5.5 5 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3 0 4.5 3.1 3 6.3C19.5 16.4 12 21 12 21z" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
