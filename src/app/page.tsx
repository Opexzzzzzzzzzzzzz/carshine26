import Link from "next/link";
import { groups, featuredProducts, allBrands, totalProducts, categoriesOfGroup } from "@/lib/shop";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = featuredProducts(8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="hero-glow absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="fade-up flex flex-col justify-center">
            <span className="mb-4 inline-flex w-max items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              ★ Профессиональная автохимия · Ставрополь
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Идеальный блеск
              <br />
              начинается с <span className="text-gold-gradient">CarShine</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
              Полироли, пасты, керамика, оборудование и аксессуары для детейлинга.
              Проверенные бренды — в наличии и с доставкой по всей России.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className="shine-sweep relative overflow-hidden rounded-xl bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-gold-2">
                Перейти в каталог
              </Link>
              <a href="https://wa.me/79180305835" className="rounded-xl border border-border-strong px-6 py-3.5 font-medium text-fg transition-colors hover:border-gold hover:text-gold">
                Консультация в WhatsApp
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                [`${totalProducts.toLocaleString("ru-RU")}+`, "товаров в каталоге"],
                [`${allBrands.length} брендов`, "профессионального уровня"],
                ["CDEK", "доставка по России"],
              ].map(([a, b]) => (
                <div key={b}>
                  <div className="font-display text-2xl font-bold text-gold">{a}</div>
                  <div className="text-sm text-fg-muted">{b}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up grid grid-cols-2 gap-3 self-center">
            {groups.slice(0, 4).map((g, i) => (
              <Link
                key={g.slug}
                href={`/catalog/${g.slug}`}
                className={`surface-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-gold/40 ${i === 0 ? "col-span-2" : ""}`}
              >
                <div className="text-3xl">{g.icon}</div>
                <div className="mt-6">
                  <div className="font-display font-semibold group-hover:text-gold">{g.title}</div>
                  <div className="mt-1 text-xs text-fg-muted">{categoriesOfGroup(g.slug).length} категорий</div>
                </div>
                <span className="absolute right-4 top-4 text-fg-dim transition-transform group-hover:translate-x-1 group-hover:text-gold">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="border-b border-border bg-bg-2">
        <div className="mx-auto grid max-w-7xl gap-px px-4 py-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🚚", "Доставка по РФ", "Ставрополь и вся Россия"],
            ["✅", "Только оригинал", "Прямые поставки"],
            ["🎓", "Подбор и консультации", "Поможем и новичку, и мастеру"],
            ["🏬", "Самовывоз", "Онежский, 28/3"],
          ].map(([icon, title, text]) => (
            <div key={title} className="flex items-start gap-3 py-6">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-fg-muted">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Разделы каталога */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="Каталог" href="/catalog" linkText="Все товары" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {groups.map((g) => (
            <Link
              key={g.slug}
              href={`/catalog/${g.slug}`}
              className="surface-card group flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:border-gold/40"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{g.icon}</span>
              <span className="text-sm font-medium group-hover:text-gold">{g.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Витрина */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHead title="Популярные товары" href="/catalog" linkText="Смотреть все" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Бренды */}
      <section className="border-t border-border bg-bg-2">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-fg-dim">
            Более {allBrands.length} проверенных брендов
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {allBrands.slice(0, 18).map((b) => (
              <span key={b} className="font-display text-lg font-semibold text-fg-muted transition-colors hover:text-fg">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <Link href={href} className="text-sm text-fg-muted transition-colors hover:text-gold">{linkText} →</Link>
    </div>
  );
}
