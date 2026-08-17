import "server-only";
import { prisma } from "@/lib/db";
import { categoryBySlug, groupBySlug, type Product } from "@/lib/shop";

const lightSelect = {
  id: true,
  slug: true,
  title: true,
  brand: true,
  price: true,
  photo: true,
  categorySlug: true,
  inStock: true,
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
};

function liteToProduct(r: LightRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    brand: r.brand,
    price: r.price,
    category: r.categorySlug,
    categoryName: categoryBySlug(r.categorySlug)?.title ?? "",
    description: "",
    photo: r.photo,
    photos: r.photo ? [r.photo] : [],
    inStock: r.inStock,
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
    price: r.price,
    category: r.categorySlug,
    categoryName: categoryBySlug(r.categorySlug)?.title ?? "",
    description: r.description,
    photo: r.photo,
    photos: photos.length ? photos : r.photo ? [r.photo] : [],
    inStock: r.inStock,
  };
}

export async function allProductsLite(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ select: lightSelect, orderBy: { title: "asc" } });
  return rows.map(liteToProduct);
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
