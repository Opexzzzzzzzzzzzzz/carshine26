"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import { useCart } from "@/lib/cart";
import { productBySlug, formatPrice } from "@/lib/shop";
import ProductImage from "./ProductImage";

export default function WishlistDrawer() {
  const fav = useFavorites();
  const { add } = useCart();
  const items = fav.ids.map(productBySlug).filter(Boolean);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${
          fav.open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => fav.setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-bg-2 transition-transform duration-300 ${
          fav.open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">
            Избранное <span className="text-fg-dim">{fav.count > 0 ? `· ${fav.count}` : ""}</span>
          </h2>
          <button
            onClick={() => fav.setOpen(false)}
            className="rounded-lg p-1.5 text-fg-muted hover:bg-surface hover:text-fg"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="text-4xl opacity-40">🤍</div>
            <p className="text-fg-muted">В избранном пока пусто</p>
            <button
              onClick={() => fav.setOpen(false)}
              className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold-2"
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {items.map((p) => (
              <div key={p!.slug} className="flex gap-3 rounded-xl border border-border bg-surface p-2.5">
                <Link href={`/product/${p!.slug}`} onClick={() => fav.setOpen(false)}>
                  <ProductImage product={p!} sizes="64px" className="h-16 w-16 shrink-0 rounded-lg" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${p!.slug}`}
                    onClick={() => fav.setOpen(false)}
                    className="line-clamp-2 text-xs font-medium leading-snug hover:text-gold"
                  >
                    {p!.title}
                  </Link>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold">{formatPrice(p!.price)}</span>
                    <button
                      onClick={() => add(p!.slug)}
                      className="rounded-lg bg-gold px-2.5 py-1.5 text-xs font-semibold text-black hover:bg-gold-2"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => fav.remove(p!.slug)}
                  className="self-start text-fg-dim hover:text-danger"
                  aria-label="Убрать"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
