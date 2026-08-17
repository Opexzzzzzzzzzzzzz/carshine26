import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты магазина CarShine: телефоны, почта, адрес в Ставрополе.",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> / Контакты
      </nav>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Контакты</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card title="Телефоны">
          <a href="tel:+79180305835" className="block hover:text-gold">+7 918 030-58-35</a>
          <a href="tel:+79288242991" className="block hover:text-gold">+7 928 824-29-91</a>
        </Card>
        <Card title="Почта">
          <a href="mailto:carshinestavropol@gmail.com" className="hover:text-gold">carshinestavropol@gmail.com</a>
        </Card>
        <Card title="Адрес">
          <a href="https://yandex.ru/maps/-/CHsiYQ5o" className="hover:text-gold">Ставрополь, пер. Онежский, 28/3</a>
        </Card>
        <Card title="Мессенджеры">
          <div className="flex gap-3">
            <a href="https://wa.me/79180305835" className="text-success hover:underline">WhatsApp</a>
            <a href="https://t.me/carshinestavropol" className="text-accent hover:underline">Telegram</a>
            <a href="https://vk.com/carshinestavropol" className="text-fg-muted hover:text-gold">VK</a>
          </div>
        </Card>
      </div>

      <a
        href="https://wa.me/79180305835"
        className="mt-8 inline-block rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2"
      >
        Написать в WhatsApp
      </a>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-dim">{title}</h3>
      <div className="text-fg">{children}</div>
    </div>
  );
}
