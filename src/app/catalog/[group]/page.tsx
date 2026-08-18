import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CatalogView from "@/components/CatalogView";
import CategoryIcon from "@/components/CategoryIcon";
import { groups, groupBySlug, categoriesOfGroup } from "@/lib/shop";
import { productsByGroupLite } from "@/lib/queries";

export function generateStaticParams() {
  return groups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}): Promise<Metadata> {
  const { group } = await params;
  const g = groupBySlug(group);
  if (!g) return {};
  return {
    title: `${g.title} — купить в CarShine`,
    description: `${g.title}: автохимия и товары для детейлинга. Доставка по Ставрополю и России.`,
  };
}

export default async function GroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ sub?: string }>;
}) {
  const { group } = await params;
  const { sub } = await searchParams;
  const g = groupBySlug(group);
  if (!g) notFound();

  const list = await productsByGroupLite(group);
  const cats = categoriesOfGroup(group);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> /{" "}
        <Link href="/catalog" className="hover:text-gold">Каталог</Link> / {g.title}
      </nav>
      <div className="flex items-center gap-3">
        <CategoryIcon name={g.icon} className="text-4xl text-gold" />
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{g.title}</h1>
          <p className="text-fg-muted">{list.length} товаров</p>
        </div>
      </div>
      <div className="mt-8">
        <CatalogView
          key={sub ?? "all"}
          products={list}
          categories={cats}
          initialSub={sub}
        />
      </div>
    </div>
  );
}
