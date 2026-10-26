"use client";

import Link from "next/link";
import type { Product } from "@/lib/shop";
import { formatPrice } from "@/lib/shop";
import { useCart } from "@/lib/cart";
import ProductImage from "./ProductImage";
import DiscountBadge from "./DiscountBadge";

export default function ProductCard({ product }: { product: Product }) {
  const { add, lines, setQty } = useCart();
  const inCart = lines.find((l) => l.slug === product.slug)?.qty ?? 0;
  const snapshot = {
    slug: product.slug,
    title: product.title,
    price: product.price,
    photo: product.photo,
  };

  return (
    <div className="group surface-card relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <Link href={`/product/${product.slug}`} className="relative block">
        <ProductImage product={product} className="aspect-square w-full" />
        {product.discount && <DiscountBadge label={product.discount} />}
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

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
          <div className="whitespace-nowrap">
            {product.oldPrice != null && (
              <div className="text-xs text-fg-dim line-through">{formatPrice(product.oldPrice)}</div>
            )}
            <div className={`text-lg font-semibold ${product.oldPrice != null ? "text-danger" : "text-fg"}`}>
              {formatPrice(product.price)}
            </div>
          </div>
          {inCart > 0 ? (
            <div className="shrink-0 text-center">
              <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gold">В корзине</div>
              <div className="flex h-9 items-center overflow-hidden rounded-xl border border-gold/60 bg-gold/10">
                <button
                  onClick={() => setQty(product.slug, inCart - 1)}
                  className="h-full w-8 text-fg-muted transition-colors hover:bg-gold/20 hover:text-gold"
                  aria-label="Убрать одну штуку"
                >
                  −
                </button>
                <span className="min-w-6 text-center text-sm font-semibold tabular-nums">{inCart}</span>
                <button
                  onClick={() => setQty(product.slug, inCart + 1)}
                  className="h-full w-8 text-fg-muted transition-colors hover:bg-gold/20 hover:text-gold"
                  aria-label="Добавить ещё одну"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => add(snapshot)}
              className="shine-sweep relative overflow-hidden rounded-xl bg-gold px-3.5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-2 active:scale-95"
              aria-label="В корзину"
            >
              В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
