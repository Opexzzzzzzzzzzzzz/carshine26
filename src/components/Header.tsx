"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { groups, categoriesOfGroup } from "@/lib/shop";
import { useCart } from "@/lib/cart";
import CategoryIcon from "./CategoryIcon";

export default function Header() {
  const { count, setOpen } = useCart();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-fg-muted">
          <span className="hidden sm:block">
            📦 Доставка по Ставрополю и всей России
          </span>
          <div className="flex items-center gap-4">
            <a href="tel:+79180305835" className="hover:text-gold">
              +7 918 030-58-35
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Меню"
        >
          <BurgerIcon />
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-bold tracking-tight">
            Car<span className="text-gold-gradient">Shine</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
          {groups.map((g) => {
            const cats = categoriesOfGroup(g.slug);
            return (
              <div
                key={g.slug}
                className="relative"
                onMouseEnter={() => setOpenMenu(g.slug)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={`/catalog/${g.slug}`}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-fg-muted transition-colors hover:bg-surface hover:text-fg"
                >
                  {g.title}
                  {cats.length > 1 && <span className="text-[9px] text-fg-dim">▾</span>}
                </Link>
                {openMenu === g.slug && cats.length > 1 && (
                  <div className="absolute left-0 top-full w-72 pt-2">
                    <div className="surface-card max-h-[70vh] overflow-y-auto scroll-thin rounded-xl p-1.5 shadow-2xl">
                      {cats.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/catalog/${g.slug}?sub=${c.slug}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-gold"
                        >
                          <span>{c.title}</span>
                          <span className="text-[11px] text-fg-dim">{c.count}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden md:block">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск товаров…"
            className="w-44 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm outline-none placeholder:text-fg-dim focus:w-60 focus:border-gold transition-all"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
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

      {mobileOpen && (
        <div className="border-t border-border bg-bg-2 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <form onSubmit={submitSearch} className="mb-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Поиск товаров…"
                className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-fg-dim focus:border-gold"
              />
            </form>
            {groups.map((g) => (
              <Link
                key={g.slug}
                href={`/catalog/${g.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 border-b border-border/50 py-3 text-sm text-fg-muted"
              >
                <CategoryIcon name={g.icon} className="text-lg text-gold" />
                {g.title}
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
