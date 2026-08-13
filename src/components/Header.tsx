"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count, setOpen } = useCart();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      {/* Верхняя строка */}
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-fg-muted">
          <span className="hidden sm:block">
            📦 Быстрая доставка по Ставрополю и всей России
          </span>
          <div className="flex items-center gap-4">
            <a href="tel:+79180305835" className="hover:text-gold">
              +7 918 030-58-35
            </a>
            <a
              href="https://wa.me/79180305835"
              className="hidden text-success hover:text-success/80 sm:inline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Основная строка */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Меню"
        >
          <BurgerIcon />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            Car<span className="text-gold-gradient">Shine</span>
          </span>
          <span className="hidden rounded bg-surface-2 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-fg-dim sm:inline">
            detailing
          </span>
        </Link>

        {/* Навигация c мега-меню */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setOpenMenu(cat.slug)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={`/catalog/${cat.slug}`}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg"
              >
                {cat.title}
                {cat.subcategories.length > 1 && (
                  <span className="text-[9px] text-fg-dim">▾</span>
                )}
              </Link>
              {openMenu === cat.slug && cat.subcategories.length > 0 && (
                <div className="absolute left-0 top-full w-64 pt-2">
                  <div className="surface-card overflow-hidden rounded-xl p-1.5 shadow-2xl">
                    <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-fg-dim">
                      {cat.tagline}
                    </div>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/catalog/${cat.slug}?sub=${sub.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-gold"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/catalog"
            className="hidden rounded-lg border border-border-strong px-3 py-2 text-sm text-fg-muted transition-colors hover:border-gold hover:text-gold sm:block"
          >
            Каталог
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-fg transition-colors hover:bg-surface-2"
            aria-label="Корзина"
          >
            <CartIcon />
            <span className="hidden sm:inline">Корзина</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-black">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="border-t border-border bg-bg-2 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 border-b border-border/50 py-3 text-sm text-fg-muted"
              >
                <span>{cat.icon}</span>
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}
function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
