import "server-only";
import { prisma } from "@/lib/db";
import { categoryBySlug, computeDiscount, groupBySlug, type Product } from "@/lib/shop";

const lightSelect = {
  id: true,
  slug: true,
  title: true,
  brand: true,
  price: true,
  photo: true,
  categorySlug: true,
  inStock: true,
  discountType: true,
  discountValue: true,
  onSale: true,
} as const;

type LightRow = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number | null;
  photo: string;
  categorySlug: string;
  inStock: boolean;
  discountType: string;
  discountValue: number;
  onSale: boolean;
};

type PriceRow = { price: number | null; discountType: string; discountValue: number; onSale: boolean };

// Итоговая цена/старая цена/бейдж. Распродажа учитывается только при активной скидке.
function pricing(r: PriceRow) {
  const d = computeDiscount(r.price, r.discountType, r.discountValue);
  return {
    price: d.valid ? d.final : r.price,
    oldPrice: d.valid ? r.price : null,
    discount: d.label,
    onSale: d.valid && r.onSale,
  };
}

function liteToProduct(r: LightRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    brand: r.brand,
    category: r.categorySlug,
    categoryName: categoryBySlug(r.categorySlug)?.title ?? "",
    description: "",
    photo: r.photo,
    photos: r.photo ? [r.photo] : [],
    inStock: r.inStock,
    ...pricing(r),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const r =
    (await prisma.product.findUnique({ where: { slug } })) ??
    (await prisma.product.findUnique({ where: { id: slug } }));
  if (!r) return null;
  let photos: string[] = [];
  try {
    photos = JSON.parse(r.photosJson);
  } catch {}
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    brand: r.brand,
    category: r.categorySlug,
    categoryName: categoryBySlug(r.categorySlug)?.title ?? "",
    description: r.description,
    photo: r.photo,
    photos: photos.length ? photos : r.photo ? [r.photo] : [],
    inStock: r.inStock,
    ...pricing(r),
  };
}

// Товары распродажи (только с активной скидкой), свежие изменения первыми.
export async function saleProductsLite(limit?: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { onSale: true },
    select: lightSelect,
    orderBy: { updatedAt: "desc" },
  });
  const list = rows.map(liteToProduct).filter((p) => p.onSale);
  return limit ? list.slice(0, limit) : list;
}

export async function allProductsLite(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ select: lightSelect, orderBy: { title: "asc" } });
  return rows.map(liteToProduct);
}

// Названия товаров + цены (для автоподсказок в редакторе заказа).
export async function productTitlesForPicker(): Promise<{ title: string; price: number | null }[]> {
  const rows = await prisma.product.findMany({
    select: { title: true, price: true, discountType: true, discountValue: true, onSale: true },
    orderBy: { title: "asc" },
  });
  // Цена с учётом скидки — как её видит покупатель.
  return rows.map((r) => ({ title: r.title, price: pricing(r).price }));
}

// Актуальный список брендов из БД (для автоподсказок в админке).
export async function distinctBrands(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { brand: { not: "" } },
    distinct: ["brand"],
    select: { brand: true },
    orderBy: { brand: "asc" },
  });
  return rows.map((r) => r.brand);
}

export async function productsByGroupLite(groupSlug: string): Promise<Product[]> {
  const g = groupBySlug(groupSlug);
  if (!g) return [];
  const rows = await prisma.product.findMany({
    where: { categorySlug: { in: g.categorySlugs } },
    select: lightSelect,
  });
  return rows.map(liteToProduct);
}

export async function searchProductsLite(q: string, limit = 120): Promise<Product[]> {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const rows = await prisma.product.findMany({ select: lightSelect });
  return rows
    .filter(
      (r) => r.title.toLowerCase().includes(s) || r.brand.toLowerCase().includes(s)
    )
    .slice(0, limit)
    .map(liteToProduct);
}

export async function relatedProductsLite(p: Product, limit = 6): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categorySlug: p.category, NOT: { id: p.id } },
    select: lightSelect,
    take: limit,
  });
  return rows.map(liteToProduct);
}

export async function featuredProductsLite(limit = 8): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { photo: { not: "" }, price: { not: null } },
    select: lightSelect,
    take: 400,
  });
  const picks: Product[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.brand)) continue;
    seen.add(r.brand);
    picks.push(liteToProduct(r));
    if (picks.length >= limit) break;
  }
  return picks;
}

export async function productCount() {
  return prisma.product.count();
}
