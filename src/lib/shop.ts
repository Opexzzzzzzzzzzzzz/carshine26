// Клиент-безопасный слой: типы, справочники (категории/бренды/группы), утилиты.
// Данные товаров теперь в БД — запросы в src/lib/queries.ts (server-only).
import categoriesData from "@/data/categories.json";
import brandsData from "@/data/brands.json";
import { groups, groupByCategory } from "@/lib/groups";

export { groups };
export type { Group } from "@/lib/groups";

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number | null;
  category: string;
  categoryName: string;
  description: string;
  photo: string;
  photos: string[];
  inStock: boolean;
};

// Снимок товара для корзины/избранного (кладётся в localStorage при добавлении).
export type CartSnapshot = {
  slug: string;
  title: string;
  price: number | null;
  photo: string;
};

export type Category = {
  slug: string;
  title: string;
  count: number;
  group: string;
};

export const categories: Category[] = (
  categoriesData as { slug: string; title: string; count: number }[]
).map((c) => ({ ...c, group: groupByCategory[c.slug] ?? "prochee" }));

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export const categoryBySlug = (slug: string) => categoryMap.get(slug);
export const groupBySlug = (slug: string) => groups.find((g) => g.slug === slug);
export const categoriesOfGroup = (groupSlug: string) =>
  categories.filter((c) => c.group === groupSlug);

export const allBrands = brandsData as string[];

export const brandsOf = (list: Product[]) =>
  Array.from(new Set(list.map((p) => p.brand).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );

export const formatPrice = (n: number | null) =>
  n == null ? "Цена по запросу" : new Intl.NumberFormat("ru-RU").format(n) + " ₽";

export const totalProducts = (categoriesData as { count: number }[]).reduce(
  (s, c) => s + c.count,
  0
);
