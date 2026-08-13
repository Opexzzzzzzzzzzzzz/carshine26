"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, formatPrice } from "@/lib/cart";
import { productBySlug } from "@/lib/catalog";
import ProductImage from "@/components/ProductImage";

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const [delivery, setDelivery] = useState("courier");
  const [pay, setPay] = useState("online");

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 font-display text-2xl font-bold">
          Заказ оформлен!
        </h1>
        <p className="mt-2 text-fg-muted">
          Это прототип — реальный заказ не отправлен. На боевом сайте здесь
          подключается оплата и уведомление менеджеру.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2"
        >
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="text-4xl opacity-40">🧺</div>
        <h1 className="mt-4 font-display text-2xl font-bold">Корзина пуста</h1>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Оформление заказа</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          clear();
          setDone(true);
        }}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <Fieldset title="Контактные данные">
            <Field label="Имя" placeholder="Как к вам обращаться" required />
            <Field label="Телефон" placeholder="+7 (___) ___-__-__" type="tel" required />
            <Field label="Email" placeholder="you@example.com" type="email" />
          </Fieldset>

          <Fieldset title="Доставка">
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ["courier", "Курьер", "по Ставрополю"],
                ["pickup", "Самовывоз", "Онежский, 28/3"],
                ["russia", "СДЭК / Почта", "по России"],
              ].map(([v, t, d]) => (
                <label
                  key={v}
                  className={`cursor-pointer rounded-xl border p-3 text-sm transition-colors ${
                    delivery === v
                      ? "border-gold bg-gold/10"
                      : "border-border-strong hover:border-fg-dim"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    className="hidden"
                    checked={delivery === v}
                    onChange={() => setDelivery(v)}
                  />
                  <div className="font-medium">{t}</div>
                  <div className="text-xs text-fg-dim">{d}</div>
                </label>
              ))}
            </div>
            {delivery !== "pickup" && (
              <Field label="Адрес" placeholder="Город, улица, дом, квартира" />
            )}
          </Fieldset>

          <Fieldset title="Оплата">
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ["online", "Онлайн-картой", "СБП / карта"],
                ["receipt", "При получении", "нал / карта"],
                ["invoice", "Счёт для юрлиц", "по реквизитам"],
              ].map(([v, t, d]) => (
                <label
                  key={v}
                  className={`cursor-pointer rounded-xl border p-3 text-sm transition-colors ${
                    pay === v
                      ? "border-gold bg-gold/10"
                      : "border-border-strong hover:border-fg-dim"
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="hidden"
                    checked={pay === v}
                    onChange={() => setPay(v)}
                  />
                  <div className="font-medium">{t}</div>
                  <div className="text-xs text-fg-dim">{d}</div>
                </label>
              ))}
            </div>
          </Fieldset>
        </div>

        {/* Сводка */}
        <aside className="h-max lg:sticky lg:top-28">
          <div className="surface-card rounded-2xl p-5">
            <h3 className="mb-4 font-semibold">Ваш заказ</h3>
            <div className="scroll-thin max-h-64 space-y-3 overflow-y-auto">
              {lines.map((l) => {
                const p = productBySlug(l.slug);
                if (!p) return null;
                return (
                  <div key={l.slug} className="flex items-center gap-3">
                    <ProductImage
                      product={p}
                      compact
                      className="h-12 w-12 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs">{p.title}</div>
                      <div className="text-xs text-fg-dim">
                        {l.qty} × {formatPrice(p.price)}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(p.price * l.qty)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>Товары</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Доставка</span>
                <span>{delivery === "pickup" ? "0 ₽" : "рассчитается"}</span>
              </div>
              <div className="flex justify-between pt-2 font-display text-lg font-bold">
                <span>Итого</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-gold py-3.5 font-semibold text-black transition-colors hover:bg-gold-2"
            >
              Подтвердить заказ
            </button>
            <p className="mt-2 text-center text-[11px] text-fg-dim">
              Нажимая, вы соглашаетесь с политикой конфиденциальности
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-fg-muted">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none placeholder:text-fg-dim focus:border-gold"
      />
    </label>
  );
}
