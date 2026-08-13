"use client";

import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <div className="group surface-card relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.hit && (
          <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold ring-1 ring-gold/30">
            Хит
          </span>
        )}
        {product.isNew && (
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent ring-1 ring-accent/30">
            Новинка
          </span>
        )}
        {product.oldPrice && (
          <span className="rounded-full bg-danger/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-danger ring-1 ring-danger/30">
            −{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>

      <Link href={`/product/${product.slug}`} className="block">
        <ProductImage product={product} className="aspect-[4/3] w-full" />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-fg-dim">
          <span className="uppercase tracking-wider">{product.brand}</span>
          <span className="text-gold">★ {product.rating.toFixed(1)}</span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-fg transition-colors hover:text-gold"
        >
          {product.title}
        </Link>

        <div className="mt-2 flex items-center gap-2 text-xs">
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

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {product.oldPrice && (
              <div className="text-xs text-fg-dim line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
            <div className="text-lg font-semibold text-fg">
              {formatPrice(product.price)}
            </div>
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
