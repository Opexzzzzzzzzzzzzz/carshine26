import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  products,
  productBySlug,
  categoryBySlug,
  relatedProducts,
  formatPrice,
} from "@/lib/catalog";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    openGraph: { title: p.title, description: p.description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();

  const cat = categoryBySlug(p.category);
  const related = relatedProducts(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    brand: p.brand,
    description: p.description,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "RUB",
      availability: p.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviews,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">
          Главная
        </Link>{" "}
        /{" "}
        <Link href="/catalog" className="hover:text-gold">
          Каталог
        </Link>{" "}
        {cat && (
          <>
            /{" "}
            <Link href={`/catalog/${cat.slug}`} className="hover:text-gold">
              {cat.title}
            </Link>{" "}
          </>
        )}
        / <span className="text-fg-muted">{p.brand}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ProductImage
            product={p}
            className="aspect-square w-full rounded-3xl"
          />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ProductImage
                key={i}
                product={p}
                compact
                className="aspect-square rounded-xl opacity-60 transition-opacity hover:opacity-100"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 text-sm">
            <span className="uppercase tracking-wider text-fg-dim">
              {p.brand}
            </span>
            <span className="text-gold">★ {p.rating.toFixed(1)}</span>
            <span className="text-fg-dim">· {p.reviews} отзывов</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">
            {p.title}
          </h1>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-bold">
              {formatPrice(p.price)}
            </span>
            {p.oldPrice && (
              <span className="mb-1 text-lg text-fg-dim line-through">
                {formatPrice(p.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-2 text-sm">
            {p.inStock ? (
              <span className="inline-flex items-center gap-2 text-success">
                <span className="h-2 w-2 rounded-full bg-success" /> В наличии,
                отгрузка сегодня
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-fg-muted">
                <span className="h-2 w-2 rounded-full bg-fg-dim" /> Под заказ,
                1–5 дней
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-fg-muted">{p.description}</p>

          <div className="mt-8">
            <AddToCartButton slug={p.slug} />
          </div>

          <a
            href={`https://wa.me/79180305835?text=Здравствуйте! Интересует товар: ${encodeURIComponent(
              p.title
            )}`}
            className="mt-3 inline-block text-sm text-fg-muted hover:text-gold"
          >
            Задать вопрос по товару в WhatsApp →
          </a>

          {/* Характеристики */}
          <div className="mt-8 surface-card rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Характеристики</h3>
            <dl className="divide-y divide-border">
              {p.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between py-2.5 text-sm"
                >
                  <dt className="text-fg-muted">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-fg-muted">
            <span>🚚 Доставка по РФ</span>
            <span>✅ Оригинальная продукция</span>
            <span>↩️ Возврат 14 дней</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">Похожие товары</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.slug} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
