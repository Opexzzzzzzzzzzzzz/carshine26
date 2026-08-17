import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { searchProductsLite } from "@/lib/queries";

export const metadata: Metadata = { title: "Поиск" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await searchProductsLite(q, 120);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> / Поиск
      </nav>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Поиск{q ? `: «${q}»` : ""}
      </h1>
      <p className="mt-2 text-fg-muted">
        {q ? `Найдено: ${results.length}` : "Введите запрос в строке поиска"}
      </p>

      {q && results.length === 0 ? (
        <div className="surface-card mt-8 flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
          <div className="text-4xl opacity-40">🔍</div>
          <p className="text-fg-muted">По запросу ничего не найдено</p>
          <Link href="/catalog" className="text-sm text-gold hover:underline">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
