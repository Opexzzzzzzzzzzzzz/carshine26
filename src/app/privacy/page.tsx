import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Политика конфиденциальности" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <nav className="mb-2 text-xs text-fg-dim">
        <Link href="/" className="hover:text-gold">Главная</Link> / Политика конфиденциальности
      </nav>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Политика конфиденциальности</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
        <p>
          Оставляя заявку на сайте, вы соглашаетесь на обработку персональных данных
          (имя, телефон, email) с целью оформления и подтверждения заказа.
        </p>
        <p>
          Мы не передаём ваши данные третьим лицам, кроме случаев, необходимых для
          доставки заказа (служба доставки). Данные используются только для связи по заказу.
        </p>
        <p>
          Для отзыва согласия на обработку данных свяжитесь с нами по телефону или почте,
          указанным на странице <Link href="/contacts" className="text-gold hover:underline">Контакты</Link>.
        </p>
        <p className="text-sm text-fg-dim">
          Финальную редакцию политики предоставит владелец магазина перед запуском.
        </p>
      </div>
    </div>
  );
}
