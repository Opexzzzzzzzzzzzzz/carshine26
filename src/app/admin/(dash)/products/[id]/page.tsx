import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { categories } from "@/lib/shop";
import { distinctBrands } from "@/lib/queries";
import { updateProduct, deleteProduct } from "../../../actions";
import ProductPhotos from "@/components/ProductPhotos";

export const dynamic = "force-dynamic";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; back?: string }>;
}) {
  const { id } = await params;
  const { created, back = "" } = await searchParams;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) notFound();

  const backUrl = `/admin/products${back ? `?${back}` : ""}`;

  const brands = await distinctBrands();

  let photos: string[] = [];
  try {
    const parsed = JSON.parse(p.photosJson);
    if (Array.isArray(parsed)) photos = parsed.map(String).filter(Boolean);
  } catch {}
  if (!photos.length && p.photo) photos = [p.photo];

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <Link href={backUrl} className="text-sm text-fg-muted hover:text-gold">← К товарам</Link>
        <Link href={`/product/${p.slug}`} className="text-sm text-fg-muted hover:text-gold">Открыть на сайте ↗</Link>
      </div>
      <h1 className="font-display text-2xl font-bold">Редактирование товара</h1>
      {created && <div className="rounded-lg bg-success/10 px-4 py-2 text-sm text-success">Товар создан</div>}

      <form action={updateProduct} className="surface-card space-y-4 rounded-2xl p-6">
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="back" value={back} />

        <Field label="Название">
          <input name="title" defaultValue={p.title} required className={inputCls} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Бренд">
            <input name="brand" defaultValue={p.brand} list="brands-list" autoComplete="off" placeholder="Начните вводить…" className={inputCls} />
            <datalist id="brands-list">
              {brands.map((b) => <option key={b} value={b} />)}
            </datalist>
          </Field>
          <Field label="Цена, ₽ (пусто = по запросу)">
            <input name="price" defaultValue={p.price ?? ""} inputMode="numeric" className={inputCls} />
          </Field>
        </div>

        <Field label="Категория">
          <select name="categorySlug" defaultValue={p.categorySlug} className={inputCls}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
        </Field>

        <Field label="Фото товара">
          <ProductPhotos name="photos" defaultValue={photos} />
        </Field>

        <Field label="Описание">
          <textarea name="description" defaultValue={p.description} rows={8} className={inputCls} />
          <span className="mt-1 block text-xs text-fg-dim">
            Поддерживается разметка: **жирный**, списки через «- » в начале строки, переносы строк сохраняются. Можно вставлять текст с другого сайта.
          </span>
        </Field>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
          <input type="checkbox" name="inStock" defaultChecked={p.inStock} className="h-4 w-4 accent-[var(--gold)]" />
          В наличии
        </label>

        <div className="flex gap-3 pt-2">
          <button className="rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">Сохранить</button>
        </div>
      </form>

      <form action={deleteProduct} className="border-t border-border pt-5">
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="back" value={back} />
        <button className="rounded-xl border border-danger/40 px-5 py-2.5 text-sm text-danger hover:bg-danger/10">
          Удалить товар
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-fg-muted">{label}</span>
      {children}
    </label>
  );
}
