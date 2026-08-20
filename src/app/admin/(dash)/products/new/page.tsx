import Link from "next/link";
import { categories } from "@/lib/shop";
import { distinctBrands } from "@/lib/queries";
import { createProduct } from "../../../actions";
import ProductPhotos from "@/components/ProductPhotos";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold";

export default async function NewProduct() {
  const brands = await distinctBrands();
  return (
    <div className="max-w-3xl space-y-5">
      <Link href="/admin/products" className="text-sm text-fg-muted hover:text-gold">← К товарам</Link>
      <h1 className="font-display text-2xl font-bold">Новый товар</h1>

      <form action={createProduct} className="surface-card space-y-4 rounded-2xl p-6">
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Название</span>
          <input name="title" required className={inputCls} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-fg-muted">Бренд</span>
            <input name="brand" list="brands-list" autoComplete="off" placeholder="Начните вводить…" className={inputCls} />
            <datalist id="brands-list">
              {brands.map((b) => <option key={b} value={b} />)}
            </datalist>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-fg-muted">Цена, ₽</span>
            <input name="price" inputMode="numeric" className={inputCls} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Категория</span>
          <select name="categorySlug" defaultValue="prochee" className={inputCls}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-1 block text-xs text-fg-muted">Фото товара</span>
          <ProductPhotos name="photos" />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Описание</span>
          <textarea name="description" rows={6} className={inputCls} />
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
          <input type="checkbox" name="inStock" defaultChecked className="h-4 w-4 accent-[var(--gold)]" />
          В наличии
        </label>
        <button className="rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">Создать товар</button>
      </form>
    </div>
  );
}
