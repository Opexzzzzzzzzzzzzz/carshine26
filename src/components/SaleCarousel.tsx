"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/shop";
import ProductCard from "./ProductCard";
import CategoryIcon from "./CategoryIcon";

// Карусель товаров распродажи на главной: свайп на мобильных, стрелки на десктопе,
// в конце — плитка-переход во весь раздел.
export default function SaleCarousel({ products, total }: { products: Product[]; total: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const itemCls =
    "grid w-[calc(50%-8px)] shrink-0 snap-start sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]";

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/15">
            <CategoryIcon name="local_offer" className="text-2xl text-danger" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Распродажа</h2>
            <p className="text-sm text-fg-muted">Товары со скидкой — пока есть в наличии</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowBtn dir={-1} disabled={!canPrev} onClick={() => scroll(-1)} />
          <ArrowBtn dir={1} disabled={!canNext} onClick={() => scroll(1)} />
          <Link href="/sale" className="ml-2 text-sm text-fg-muted transition-colors hover:text-gold">
            Вся распродажа →
          </Link>
        </div>
      </div>

      <div
        ref={track}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className={itemCls}>
            <ProductCard product={p} />
          </div>
        ))}
        <div className={itemCls}>
          <Link
            href="/sale"
            className="group flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-danger/30 bg-gradient-to-br from-danger/15 to-transparent p-6 text-center transition-all hover:-translate-y-1 hover:border-danger/60"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger text-white transition-transform group-hover:scale-110">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <div className="font-display text-lg font-bold">Все товары со скидкой</div>
              <div className="mt-1 text-sm text-fg-muted">{total} в разделе «Распродажа»</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowBtn({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Следующие товары" : "Предыдущие товары"}
      className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-strong text-fg-muted transition-colors hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30 sm:flex"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d={dir === 1 ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
