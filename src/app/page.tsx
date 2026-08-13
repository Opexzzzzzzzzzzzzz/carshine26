import Link from "next/link";
import { categories, hitProducts, newProducts, brands } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const hits = hitProducts();
  const fresh = newProducts();

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
              начинается с{" "}
              <span className="text-gold-gradient">CarShine</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
              Полироли, пасты, керамика, оборудование и аксессуары для
              детейлинга. Проверенные бренды Koch Chemie, Shine Systems и POLYTOP —
              в наличии и с доставкой по всей России.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="shine-sweep relative overflow-hidden rounded-xl bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-gold-2"
              >
                Перейти в каталог
              </Link>
              <a
                href="https://wa.me/79180305835"
                className="rounded-xl border border-border-strong px-6 py-3.5 font-medium text-fg transition-colors hover:border-gold hover:text-gold"
              >
                Консультация в WhatsApp
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                ["500+", "товаров в каталоге"],
                ["4 бренда", "профессионального уровня"],
                ["CDEK", "доставка по России"],
              ].map(([a, b]) => (
                <div key={b}>
                  <div className="font-display text-2xl font-bold text-gold">
                    {a}
                  </div>
                  <div className="text-sm text-fg-muted">{b}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Витрина категорий-плиток */}
          <div className="fade-up grid grid-cols-2 gap-3 self-center">
            {categories.slice(0, 4).map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                className={`surface-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-gold/40 ${
                  i === 0 ? "col-span-2 row-span-1" : ""
                }`}
              >
                <div className="text-3xl">{cat.icon}</div>
                <div className="mt-6">
                  <div className="font-display font-semibold group-hover:text-gold">
                    {cat.title}
                  </div>
                  <div className="mt-1 text-xs text-fg-muted">{cat.tagline}</div>
                </div>
                <span className="absolute right-4 top-4 text-fg-dim transition-transform group-hover:translate-x-1 group-hover:text-gold">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="border-b border-border bg-bg-2">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🚚", "Доставка по РФ", "Ставрополь и вся Россия, 1–3 дня"],
            ["✅", "Только оригинал", "Прямые поставки, гарантия качества"],
            ["🎓", "Подбор и консультации", "Поможем и новичку, и мастеру"],
            ["💳", "Удобная оплата", "Онлайн, при получении, для юрлиц"],
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

      {/* Категории */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHead title="Категории" href="/catalog" linkText="Весь каталог" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="surface-card group flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:border-gold/40"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {cat.icon}
              </span>
              <span className="text-sm font-medium group-hover:text-gold">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Хиты продаж — «оживший» каталог */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <SectionHead
          title="Хиты продаж"
          href="/catalog"
          linkText="Смотреть все"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {hits.slice(0, 8).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Баннер керамики */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="gloss surface-card relative overflow-hidden rounded-3xl px-8 py-14 text-center">
          <div className="hero-glow absolute inset-0" />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold sm:text-4xl">
              Защита кузова{" "}
              <span className="text-gold-gradient">на 2 года</span>
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-fg-muted">
              Керамические покрытия 9H с гидрофобным эффектом и стойкостью к
              реагентам. Глубокий блеск и защита в одном флаконе.
            </p>
            <Link
              href="/catalog/moyka-i-uhod?sub=keramika"
              className="mt-8 inline-block rounded-xl bg-gold px-6 py-3.5 font-semibold text-black transition-colors hover:bg-gold-2"
            >
              Выбрать керамику
            </Link>
          </div>
        </div>
      </section>

      {/* Новинки */}
      {fresh.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <SectionHead title="Новинки" href="/catalog" linkText="Смотреть все" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {fresh.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Бренды */}
      <section className="border-t border-border bg-bg-2">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-fg-dim">
            Работаем с проверенными брендами
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.map((b) => (
              <span
                key={b}
                className="font-display text-xl font-semibold text-fg-muted transition-colors hover:text-fg"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  title,
  href,
  linkText,
}: {
  title: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <Link
        href={href}
        className="text-sm text-fg-muted transition-colors hover:text-gold"
      >
        {linkText} →
      </Link>
    </div>
  );
}
