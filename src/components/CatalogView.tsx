"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

type Sort = "default" | "price-asc" | "price-desc" | "title-asc" | "rating";

export default function CatalogView({
  products,
  category,
  initialSub,
}: {
  products: Product[];
  category?: Category;
  initialSub?: string;
}) {
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [sub, setSub] = useState<string | null>(initialSub ?? null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("default");
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const priceCeil = useMemo(
    () => Math.max(...products.map((p) => p.price), 1000),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (brandFilter.length && !brandFilter.includes(p.brand)) return false;
      if (sub && p.subcategory !== sub) return false;
      if (inStockOnly && !p.inStock) return false;
      if (maxPrice && p.price > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title, "ru"));
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [products, query, brandFilter, sub, inStockOnly, maxPrice, sort]);

  const toggleBrand = (b: string) =>
    setBrandFilter((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const resetAll = () => {
    setQuery("");
    setBrandFilter([]);
    setSub(null);
    setInStockOnly(false);
    setMaxPrice(0);
    setSort("default");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Фильтры */}
      <aside className="h-max space-y-5 lg:sticky lg:top-28">
        <div className="surface-card rounded-2xl p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию…"
            className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none placeholder:text-fg-dim focus:border-gold"
          />
        </div>

        {category && category.subcategories.length > 1 && (
          <div className="surface-card rounded-2xl p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">
              Категория
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSub(null)}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${
                  !sub ? "bg-surface-2 text-gold" : "text-fg-muted hover:text-fg"
                }`}
              >
                Все
              </button>
              {category.subcategories.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setSub(s.slug)}
                  className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${
                    sub === s.slug
                      ? "bg-surface-2 text-gold"
                      : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="surface-card rounded-2xl p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">
            Бренд
          </h4>
          <div className="space-y-2">
            {allBrands.map((b) => (
              <label
                key={b}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted"
              >
                <input
                  type="checkbox"
                  checked={brandFilter.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="h-4 w-4 accent-[var(--gold)]"
                />
                {b}
              </label>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-2xl p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-dim">
            Цена до {(maxPrice || priceCeil).toLocaleString("ru-RU")} ₽
          </h4>
          <input
            type="range"
            min={0}
            max={priceCeil}
            step={100}
            value={maxPrice || priceCeil}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            Только в наличии
          </label>
        </div>

        <button
          onClick={resetAll}
          className="w-full rounded-xl border border-border-strong py-2.5 text-sm text-fg-muted transition-colors hover:border-gold hover:text-gold"
        >
          Сбросить фильтры
        </button>
      </aside>

      {/* Результаты */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-fg-muted">
            Найдено:{" "}
            <span className="font-semibold text-fg">{filtered.length}</span>
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option value="default">Сортировка: по умолчанию</option>
            <option value="rating">Сначала популярные</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="title-asc">Название: А—Я</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
            <div className="text-4xl opacity-40">🔍</div>
            <p className="text-fg-muted">Ничего не найдено по фильтрам</p>
            <button
              onClick={resetAll}
              className="text-sm text-gold hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
