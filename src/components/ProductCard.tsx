"use client";

import Link from "next/link";
import type { Product } from "@/lib/shop";
import { formatPrice } from "@/lib/shop";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const fav = useFavorites();
  const liked = fav.has(product.slug);

  return (
    <div className="group surface-card relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <button
        onClick={() => fav.toggle(product.slug)}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors ${
          liked
            ? "bg-gold/20 text-gold"
            : "bg-black/20 text-white/70 hover:text-gold"
        }`}
        aria-label="В избранное"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
          <path d="M12 21s-7.5-4.6-10-9.2C.5 8.6 2 5.5 5 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3 0 4.5 3.1 3 6.3C19.5 16.4 12 21 12 21z" strokeLinejoin="round" />
        </svg>
      </button>

      <Link href={`/product/${product.slug}`} className="block">
        <ProductImage product={product} className="aspect-square w-full" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-dim">
          {product.brand || " "}
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-3 text-sm font-medium leading-snug text-fg transition-colors hover:text-gold"
        >
          {product.title}
        </Link>

        <div className="mt-2 text-xs">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> В наличии
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-fg-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-fg-dim" /> Под заказ
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="text-lg font-semibold text-fg">
            {formatPrice(product.price)}
          </div>
          <button
            onClick={() => add(product.slug)}
            className="shine-sweep relative overflow-hidden rounded-xl bg-gold px-3.5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-2 active:scale-95"
            aria-label="В корзину"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
