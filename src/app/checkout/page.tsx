"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, formatPrice } from "@/lib/cart";
import { productBySlug } from "@/lib/shop";
import ProductImage from "@/components/ProductImage";

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", promo: "" });
  const [agree, setAgree] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agree) { setError("Подтвердите согласие с политикой конфиденциальности"); return; }
    setSending(true);
    try {
      const items = lines
        .map((l) => {
          const p = productBySlug(l.slug);
          return p ? { title: p.title, qty: l.qty, price: p.price, sum: (p.price ?? 0) * l.qty } : null;
        })
        .filter(Boolean);
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, total, items }),
      });
      if (!res.ok) throw new Error("bad response");
      clear();
      setDone(true);
    } catch {
      setError("Не удалось отправить заказ. Попробуйте ещё раз или свяжитесь с нами в WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 font-display text-2xl font-bold">Заявка отправлена!</h1>
        <p className="mt-2 text-fg-muted">
          Мы получили ваш заказ и свяжемся с вами для подтверждения. Спасибо!
        </p>
        <Link href="/catalog" className="mt-6 inline-block rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">
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
        <Link href="/catalog" className="mt-6 inline-block rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Оформление заказа</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="surface-card rounded-2xl p-6">
          <h3 className="mb-4 font-semibold">Ваши данные</h3>
          <div className="space-y-3">
            <Field label="Ваше имя" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="Как к вам обращаться" />
            <Field label="Ваш Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />
            <Field label="Номер телефона" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="+7 (___) ___-__-__" />
            <Field label="Промокод" value={form.promo} onChange={(v) => setForm({ ...form, promo: v })} placeholder="если есть" />
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-fg-muted">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--gold)]" />
            <span>
              Я согласен с{" "}
              <Link href="/privacy" className="text-gold hover:underline">политикой конфиденциальности</Link>
            </span>
          </label>

          {error && <div className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
        </div>

        <aside className="h-max lg:sticky lg:top-28">
          <div className="surface-card rounded-2xl p-5">
            <h3 className="mb-4 font-semibold">Ваш заказ</h3>
            <div className="scroll-thin max-h-72 space-y-3 overflow-y-auto">
              {lines.map((l) => {
                const p = productBySlug(l.slug);
                if (!p) return null;
                return (
                  <div key={l.slug} className="flex items-center gap-3">
                    <ProductImage product={p} sizes="48px" className="h-12 w-12 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-xs">{p.title}</div>
                      <div className="text-xs text-fg-dim">{l.qty} × {formatPrice(p.price)}</div>
                    </div>
                    <div className="text-sm font-medium">{p.price ? formatPrice(p.price * l.qty) : "—"}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-lg font-bold">
              <span>Итоговая сумма</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-5 w-full rounded-xl bg-gold py-3.5 font-semibold text-black transition-colors hover:bg-gold-2 disabled:opacity-60"
            >
              {sending ? "Отправляем…" : "Оформить заказ"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-fg-muted">{label}{required && <span className="text-gold"> *</span>}</span>
      <input
        type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none placeholder:text-fg-dim focus:border-gold"
      />
    </label>
  );
}
