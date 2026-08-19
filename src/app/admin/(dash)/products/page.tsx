import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/shop";
import { toggleStock } from "../../actions";

export const dynamic = "force-dynamic";
const PER = 30;

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; saved?: string; deleted?: string; sort?: string }>;
}) {
  const { q = "", page = "1", saved, deleted, sort = "title" } = await searchParams;
  const p = Math.max(1, Number(page) || 1);
  const where: Prisma.ProductWhereInput = q
    ? { OR: [{ title: { contains: q } }, { brand: { contains: q } }] }
    : {};
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "new" ? { createdAt: "desc" } : { title: "asc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (p - 1) * PER,
      take: PER,
      select: { id: true, slug: true, title: true, brand: true, price: true, photo: true, inStock: true },
    }),
    prisma.product.count({ where }),
  ]);
  const pages = Math.ceil(total / PER);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Товары <span className="text-fg-dim">· {total}</span></h1>
        <Link href="/admin/products/new" className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold-2">
          + Добавить товар
        </Link>
      </div>

      {(saved || deleted) && (
        <div className="rounded-lg bg-success/10 px-4 py-2 text-sm text-success">
          {saved ? "Сохранено" : "Товар удалён"}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex gap-2">
          <input type="hidden" name="sort" value={sort} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Поиск по названию или бренду…"
            className="w-72 max-w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button className="rounded-lg border border-border-strong px-4 py-2 text-sm hover:border-gold hover:text-gold">Найти</button>
        </form>

        <div className="flex items-center gap-1 text-sm">
          <span className="mr-1 text-xs text-fg-dim">Сортировка:</span>
          {[
            ["title", "По названию"],
            ["new", "Сначала новые"],
          ].map(([s, label]) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (s !== "title") params.set("sort", s);
            const qs = params.toString();
            return (
              <Link
                key={s}
                href={`/admin/products${qs ? `?${qs}` : ""}`}
                className={`rounded-lg px-3 py-1.5 ${sort === s ? "bg-gold text-black" : "border border-border-strong text-fg-muted hover:text-gold"}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="surface-card overflow-hidden rounded-2xl">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-fg-dim">
              <tr className="border-b border-border">
                <th className="p-3 font-medium">Фото</th>
                <th className="p-3 font-medium">Название</th>
                <th className="p-3 font-medium">Бренд</th>
                <th className="p-3 font-medium">Цена</th>
                <th className="p-3 font-medium">Наличие</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-border/60 hover:bg-surface-2">
                  <td className="p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.photo || undefined} alt="" className="h-10 w-10 rounded bg-[#f4f4f2] object-contain" />
                  </td>
                  <td className="max-w-sm p-3">
                    <Link href={`/admin/products/${it.id}`} className="line-clamp-2 hover:text-gold">{it.title}</Link>
                  </td>
                  <td className="p-3 text-fg-muted">{it.brand}</td>
                  <td className="p-3 font-medium">{formatPrice(it.price)}</td>
                  <td className="p-3">
                    <form action={toggleStock}>
                      <input type="hidden" name="id" value={it.id} />
                      <button
                        className={`relative h-6 w-11 rounded-full transition-colors ${it.inStock ? "bg-success" : "bg-border-strong"}`}
                        aria-label="Наличие"
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${it.inStock ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/products/${it.id}`} className="text-gold hover:underline">Изменить</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: pages }).slice(0, 20).map((_, i) => {
            const n = i + 1;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (sort !== "title") params.set("sort", sort);
            params.set("page", String(n));
            return (
              <Link
                key={n}
                href={`/admin/products?${params.toString()}`}
                className={`rounded-lg px-3 py-1.5 text-sm ${n === p ? "bg-gold text-black" : "border border-border-strong text-fg-muted hover:text-gold"}`}
              >
                {n}
              </Link>
            );
          })}
          {pages > 20 && <span className="text-sm text-fg-dim">… {pages}</span>}
        </div>
      )}
    </div>
  );
}
