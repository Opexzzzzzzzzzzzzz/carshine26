import type { Metadata } from "next";
import CatalogView from "@/components/CatalogView";
import { totalProducts } from "@/lib/shop";
import { allProductsLite } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Каталог — вся автохимия и оборудование для детейлинга",
  description:
    "Полный каталог CarShine: полировка, мойка и уход, оборудование, аксессуары, плёнка и наборы. Более 1700 товаров.",
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const list = await allProductsLite();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-2 text-xs text-fg-dim">Главная / Каталог</nav>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Каталог</h1>
      <p className="mt-2 max-w-2xl text-fg-muted">
        {totalProducts.toLocaleString("ru-RU")} товаров для детейлинга. Используйте
        фильтры, чтобы быстро найти нужное.
      </p>
      <div className="mt-8">
        <CatalogView products={list} />
      </div>
    </div>
  );
}
