import Link from "next/link";
import { groups } from "@/lib/shop";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold">
            Car<span className="text-gold-gradient">Shine</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
            Детейлинг-маркет автохимии, аксессуаров и оборудования. Для
            профессионалов и тех, кто любит ухоженный автомобиль.
          </p>
          <div className="mt-4 flex gap-2">
            {[
              ["VK", "https://vk.com/carshinestavropol"],
              ["TG", "https://t.me/carshinestavropol"],
            ].map(([s, href]) => (
              <a
                key={s}
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs text-fg-muted transition-colors hover:border-gold hover:text-gold"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-dim">
            Каталог
          </h4>
          <ul className="space-y-2 text-sm">
            {groups.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/catalog/${g.slug}`}
                  className="text-fg-muted transition-colors hover:text-gold"
                >
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-dim">
            Покупателю
          </h4>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><Link href="/catalog" className="hover:text-gold">Все товары</Link></li>
            <li><Link href="/about" className="hover:text-gold">О нас</Link></li>
            <li><Link href="/contacts" className="hover:text-gold">Контакты</Link></li>
            <li><Link href="/privacy" className="hover:text-gold">Политика конфиденциальности</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-fg-dim">
            Контакты
          </h4>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li><a href="tel:+79180305835" className="hover:text-gold">+7 918 030-58-35</a></li>
            <li><a href="tel:+79288242991" className="hover:text-gold">+7 928 824-29-91</a></li>
            <li><a href="mailto:carshinestavropol@gmail.com" className="hover:text-gold">carshinestavropol@gmail.com</a></li>
            <li>
              <a
                href="https://yandex.ru/maps/-/CHsiYQ5o"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                Ставрополь, пер. Онежский, 28/3
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-fg-dim">
          <p className="mb-2 leading-relaxed">
            Вся информация на сайте, включая цены и наличие товаров, носит
            справочный характер и не является публичной офертой, определяемой
            положениями статьи 437 Гражданского кодекса РФ.
          </p>
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <span>© {new Date().getFullYear()} CarShine · Детейлинг-маркет</span>
            <span>Ставрополь</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
