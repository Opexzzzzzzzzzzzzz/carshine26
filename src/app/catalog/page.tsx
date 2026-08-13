import type { Metadata } from "next";
import CatalogView from "@/components/CatalogView";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог — вся автохимия и оборудование",
  description:
    "Полный каталог CarShine: полировка, мойка и уход, оборудование, аксессуары, плёнка и наборы.",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-2 text-xs text-fg-dim">Главная / Каталог</nav>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Каталог</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        Всё для детейлинга в одном месте. Используйте фильтры, чтобы быстро найти
        нужное.
      </p>
      <div className="mt-8">
        <CatalogView products={products} />
      </div>
    </div>
  );
}
