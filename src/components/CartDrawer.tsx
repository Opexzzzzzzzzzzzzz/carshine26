"use client";

import Link from "next/link";
import { useCart, formatPrice } from "@/lib/cart";
import { productBySlug } from "@/lib/catalog";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { open, setOpen, lines, total, setQty, remove, count } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-bg-2 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">
            Корзина{" "}
            <span className="text-fg-dim">
              {count > 0 ? `· ${count}` : ""}
            </span>
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-fg-muted hover:bg-surface hover:text-fg"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="text-4xl opacity-40">🧺</div>
            <p className="text-fg-muted">Корзина пуста</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold-2"
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <>
            <div className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {lines.map((line) => {
                const p = productBySlug(line.slug);
                if (!p) return null;
                return (
                  <div
                    key={line.slug}
                    className="flex gap-3 rounded-xl border border-border bg-surface p-2.5"
                  >
                    <ProductImage
                      product={p}
                      compact
                      className="h-16 w-16 shrink-0 rounded-lg"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="line-clamp-2 text-xs font-medium leading-snug">
                        {p.title}
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-lg border border-border-strong">
                          <button
                            onClick={() => setQty(line.slug, line.qty - 1)}
                            className="px-2.5 py-1 text-fg-muted hover:text-gold"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => setQty(line.slug, line.qty + 1)}
                            className="px-2.5 py-1 text-fg-muted hover:text-gold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(p.price * line.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(line.slug)}
                      className="self-start text-fg-dim hover:text-danger"
                      aria-label="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-fg-muted">Итого</span>
                <span className="font-display text-xl font-bold">
                  {formatPrice(total)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-gold py-3 text-center font-semibold text-black transition-colors hover:bg-gold-2"
              >
                Оформить заказ
              </Link>
              <p className="mt-2 text-center text-[11px] text-fg-dim">
                Прототип · оплата подключается на этапе MVP
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
