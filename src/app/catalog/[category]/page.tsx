import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CatalogView from "@/components/CatalogView";
import {
  categories,
  categoryBySlug,
  productsByCategory,
} from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.title} — купить в CarShine`,
    description: `${cat.title}: ${cat.tagline}. Доставка по Ставрополю и России.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { category } = await params;
  const { sub } = await searchParams;
  const cat = categoryBySlug(category);
  if (!cat) notFound();

  const list = productsByCategory(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">
          Главная
        </Link>{" "}
        /{" "}
        <Link href="/catalog" className="hover:text-gold">
          Каталог
        </Link>{" "}
        / {cat.title}
      </nav>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{cat.icon}</span>
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {cat.title}
          </h1>
          <p className="text-fg-muted">{cat.tagline}</p>
        </div>
      </div>
      <div className="mt-8">
        <CatalogView products={list} category={cat} initialSub={sub} />
      </div>
    </div>
  );
}
