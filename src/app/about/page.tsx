import type { Metadata } from "next";
import Link from "next/link";
import { totalProducts } from "@/lib/shop";
import { distinctBrands } from "@/lib/queries";

export const metadata: Metadata = {
  title: "О нас",
  description: "CarShine — магазин автохимии и товаров для детейлинга в Ставрополе.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const brandsCount = (await distinctBrands()).length;
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> / О нас
      </nav>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">О магазине CarShine</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          CarShine — магазин автохимии для тех, кто любит ухоженный автомобиль. У нас
          большой выбор средств по уходу за кузовом, салоном и деталями. Мы знаем свой
          товар и всегда поможем с выбором — и для новичка, и для профи.
        </p>
        <p>
          В каталоге более {totalProducts.toLocaleString("ru-RU")} товаров от {brandsCount}{" "}
          проверенных брендов: полироли и пасты, шампуни, керамика и защитные составы,
          оборудование, микрофибра и аксессуары для детейлинга.
        </p>
        <p>
          Отгружаем по Ставрополю и всей России, консультируем по подбору. Работаем и с
          частными клиентами, и с детейлинг-студиями.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          [`${totalProducts.toLocaleString("ru-RU")}+`, "товаров"],
          [`${brandsCount}`, "брендов"],
          ["CDEK", "доставка по РФ"],
        ].map(([a, b]) => (
          <div key={b} className="surface-card rounded-2xl p-5 text-center">
            <div className="font-display text-2xl font-bold text-gold">{a}</div>
            <div className="mt-1 text-sm text-fg-muted">{b}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/catalog" className="rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">В каталог</Link>
        <Link href="/contacts" className="rounded-xl border border-border-strong px-6 py-3 font-medium text-fg hover:border-gold hover:text-gold">Контакты</Link>
      </div>
    </div>
  );
}
