import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import CatalogView from "@/components/CatalogView";
import CategoryIcon from "@/components/CategoryIcon";
import { plural } from "@/lib/shop";
import { saleProductsLite } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Распродажа — товары со скидкой",
  description: "Автохимия и товары для детейлинга со скидкой в CarShine. Доставка по Ставрополю и России.",
};

export const dynamic = "force-dynamic";

export default async function SalePage() {
  const list = await saleProductsLite();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> / Распродажа
      </nav>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/15">
          <CategoryIcon name="local_offer" className="text-3xl text-danger" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Распродажа</h1>
          <p className="text-fg-muted">
            {list.length} {plural(list.length, ["товар", "товара", "товаров"])} со скидкой
          </p>
        </div>
      </div>

      <div className="mt-8">
        {list.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
            <CategoryIcon name="local_offer" className="text-5xl text-fg-dim" />
            <p className="text-fg-muted">Сейчас акций нет — загляните позже</p>
            <Link href="/catalog" className="text-sm text-gold hover:underline">Перейти в каталог</Link>
          </div>
        ) : (
          <Suspense fallback={null}>
            <CatalogView products={list} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
