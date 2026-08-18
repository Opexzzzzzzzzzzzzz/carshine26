import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categoryBySlug, groupBySlug, formatPrice } from "@/lib/shop";
import { getProductBySlug, relatedProductsLite } from "@/lib/queries";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import ProductActions from "@/components/ProductActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const desc = (p.description || `${p.title}. Купить в CarShine.`).slice(0, 300);
  return {
    title: p.title,
    description: desc,
    openGraph: { title: p.title, description: desc, images: p.photo ? [p.photo] : [] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const cat = categoryBySlug(p.category);
  const group = cat ? groupBySlug(cat.group) : undefined;
  const related = await relatedProductsLite(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    brand: p.brand,
    description: p.description,
    image: p.photos,
    sku: p.id,
    offers: {
      "@type": "Offer",
      price: p.price ?? undefined,
      priceCurrency: "RUB",
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> /{" "}
        <Link href="/catalog" className="hover:text-gold">Каталог</Link>{" "}
        {group && cat && (
          <>
            / <Link href={`/catalog/${group.slug}`} className="hover:text-gold">{group.title}</Link>{" "}
            / <Link href={`/catalog/${group.slug}?sub=${cat.slug}`} className="hover:text-gold">{cat.title}</Link>{" "}
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery photos={p.photos} title={p.title} />

        <div>
          <div className="text-sm uppercase tracking-wider text-fg-dim">{p.brand}</div>
          <h1 className="mt-2 font-display text-2xl font-bold leading-snug sm:text-3xl">{p.title}</h1>

          <div className="mt-6 font-display text-4xl font-bold">{formatPrice(p.price)}</div>

          <div className="mt-2 text-sm">
            {p.inStock ? (
              <span className="inline-flex items-center gap-2 text-success">
                <span className="h-2 w-2 rounded-full bg-success" /> В наличии
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-fg-muted">
                <span className="h-2 w-2 rounded-full bg-fg-dim" /> Под заказ
              </span>
            )}
          </div>

          <div className="mt-8">
            <ProductActions item={{ slug: p.slug, title: p.title, price: p.price, photo: p.photo }} />
          </div>

          <a
            href="tel:+79180305835"
            className="mt-3 inline-block text-sm text-fg-muted hover:text-gold"
          >
            Задать вопрос по товару — позвоните нам →
          </a>

          {p.description && (
            <div className="mt-8 surface-card rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Описание</h3>
              <p className="whitespace-pre-line leading-relaxed text-fg-muted">{p.description}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-fg-muted">
            <span>🚚 Доставка по РФ</span>
            <span>✅ Оригинальная продукция</span>
            <span>🏬 Самовывоз в Ставрополе</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">Похожие товары</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
