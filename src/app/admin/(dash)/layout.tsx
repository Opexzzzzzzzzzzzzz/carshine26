import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { logout } from "../auth-actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-bold">
            Панель <span className="text-gold-gradient">CarShine</span>
          </span>
          <nav className="flex gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-1.5 text-fg-muted hover:bg-surface hover:text-fg">Сводка</Link>
            <Link href="/admin/products" className="rounded-lg px-3 py-1.5 text-fg-muted hover:bg-surface hover:text-fg">Товары</Link>
            <Link href="/admin/orders" className="rounded-lg px-3 py-1.5 text-fg-muted hover:bg-surface hover:text-fg">Заказы</Link>
            <Link href="/admin/settings" className="rounded-lg px-3 py-1.5 text-fg-muted hover:bg-surface hover:text-fg">Настройки</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-fg-muted hover:text-gold">← На сайт</Link>
          <form action={logout}>
            <button className="rounded-lg border border-border-strong px-3 py-1.5 text-sm text-fg-muted hover:border-danger hover:text-danger">
              Выйти
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
