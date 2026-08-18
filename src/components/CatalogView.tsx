"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, Category } from "@/lib/shop";
import { brandsOf } from "@/lib/shop";
import ProductCard from "./ProductCard";

type Sort = "default" | "price-asc" | "price-desc" | "title-asc";
const PAGE = 24;

export default function CatalogView({
  products,
  categories,
  initialSub,
}: {
  products: Product[];
  categories?: Category[]; // подкатегории (для страницы раздела)
  initialSub?: string;
}) {
  const priceCeil = useMemo(
    () => Math.max(1000, ...products.map((p) => p.price ?? 0)),
    [products]
  );

  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [sub, setSub] = useState<string | null>(initialSub ?? null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("default");
  const [maxPrice, setMaxPrice] = useState(0);
  const [limit, setLimit] = useState(PAGE);
  const [brandsOpen, setBrandsOpen] = useState(false);

  // Бренды показываем только те, у которых есть товары в выбранной категории.
  const availableBrands = useMemo(() => {
    const base = sub ? products.filter((p) => p.category === sub) : products;
    return brandsOf(base);
  }, [products, sub]);

  // Если сменили категорию — снимаем выбранные бренды, которых в ней нет.
  useEffect(() => {
    setBrandFilter((prev) => prev.filter((b) => availableBrands.includes(b)));
  }, [availableBrands]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (brandFilter.length && !brandFilter.includes(p.brand)) return false;
      if (sub && p.category !== sub) return false;
      if (inStockOnly && !p.inStock) return false;
      if (maxPrice && (p.price ?? 0) > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
    else if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === "title-asc")
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "ru"));
    return list;
  }, [products, query, brandFilter, sub, inStockOnly, maxPrice, sort]);

  const shown = filtered.slice(0, limit);

  const toggleBrand = (b: string) => {
    setLimit(PAGE);
    setBrandFilter((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };
  const resetAll = () => {
    setQuery(""); setBrandFilter([]); setSub(null);
    setInStockOnly(false); setMaxPrice(0); setSort("default"); setLimit(PAGE);
  };

  const visibleBrands = brandsOpen ? availableBrands : availableBrands.slice(0, 8);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-max space-y-5 lg:sticky lg:top-28">
        <div className="surface-card rounded-2xl p-4">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }}
            placeholder="Поиск в разделе…"
            className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none placeholder:text-fg-dim focus:border-gold"
          />
        </div>

        {categories && categories.length > 1 && (
          <div className="surface-card rounded-2xl p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">Категория</h4>
            <div className="max-h-72 space-y-1 overflow-y-auto scroll-thin">
              <button
                onClick={() => { setSub(null); setLimit(PAGE); }}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${!sub ? "bg-surface-2 text-gold" : "text-fg-muted hover:text-fg"}`}
              >
                Все
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => { setSub(c.slug); setLimit(PAGE); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm ${sub === c.slug ? "bg-surface-2 text-gold" : "text-fg-muted hover:text-fg"}`}
                >
                  <span>{c.title}</span>
                  <span className="text-[11px] text-fg-dim">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="surface-card rounded-2xl p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">Бренд</h4>
          <div className="space-y-2">
            {visibleBrands.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
                <input type="checkbox" checked={brandFilter.includes(b)} onChange={() => toggleBrand(b)} className="h-4 w-4 accent-[var(--gold)]" />
                {b}
              </label>
            ))}
          </div>
          {availableBrands.length > 8 && (
            <button onClick={() => setBrandsOpen((v) => !v)} className="mt-3 text-xs text-gold hover:underline">
              {brandsOpen ? "Свернуть" : `Ещё ${availableBrands.length - 8}`}
            </button>
          )}
        </div>

        <div className="surface-card rounded-2xl p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">
            Цена до {(maxPrice || priceCeil).toLocaleString("ru-RU")} ₽
          </h4>
          <input
            type="range" min={0} max={priceCeil} step={100}
            value={maxPrice || priceCeil}
            onChange={(e) => { setMaxPrice(Number(e.target.value)); setLimit(PAGE); }}
            className="w-full accent-[var(--gold)]"
          />
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setLimit(PAGE); }} className="h-4 w-4 accent-[var(--gold)]" />
            Только в наличии
          </label>
        </div>

        <button onClick={resetAll} className="w-full rounded-xl border border-border-strong py-2.5 text-sm text-fg-muted transition-colors hover:border-gold hover:text-gold">
          Сбросить фильтры
        </button>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-fg-muted">
            Найдено: <span className="font-semibold text-fg">{filtered.length}</span>
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option value="default">Сортировка: по умолчанию</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="title-asc">Название: А—Я</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
            <div className="text-4xl opacity-40">🔍</div>
            <p className="text-fg-muted">Ничего не найдено по фильтрам</p>
            <button onClick={resetAll} className="text-sm text-gold hover:underline">Сбросить фильтры</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {shown.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {limit < filtered.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setLimit((l) => l + PAGE)}
                  className="rounded-xl border border-border-strong px-6 py-3 text-sm font-medium text-fg-muted transition-colors hover:border-gold hover:text-gold"
                >
                  Показать ещё ({filtered.length - limit})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
