import type { Metadata } from "next";
import { login } from "../auth-actions";

export const metadata: Metadata = { title: "Вход в панель", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="surface-card rounded-2xl p-8">
        <div className="mb-1 font-display text-xl font-bold">
          Car<span className="text-gold-gradient">Shine</span>
        </div>
        <h1 className="mb-6 text-sm text-fg-muted">Панель управления</h1>
        <form action={login} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-fg-muted">Пароль</label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          {e && <div className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">Неверный пароль</div>}
          <button className="w-full rounded-xl bg-gold py-3 font-semibold text-black transition-colors hover:bg-gold-2">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
