// Клиент-безопасный слой: типы, справочники (категории/бренды/группы), утилиты.
// Данные товаров теперь в БД — запросы в src/lib/queries.ts (server-only).
import categoriesData from "@/data/categories.json";
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
  // price — итоговая цена (со скидкой). oldPrice — цена до скидки, если скидка есть.
  oldPrice: number | null;
  discount: string; // подпись бейджа: «−15%» / «−500 ₽», пусто если скидки нет
  onSale: boolean;
};

export type DiscountType = "" | "percent" | "amount";

// Единый расчёт скидки для витрины, админки и сервера.
export function computeDiscount(price: number | null, type: string, value: number) {
  const v = Math.round(Number(value) || 0);
  if (price == null || price <= 0) return { valid: false, final: price, label: "" };
  if (type === "percent" && v >= 1 && v <= 99) {
    return { valid: true, final: Math.round((price * (100 - v)) / 100), label: `−${v}%` };
  }
  if (type === "amount" && v >= 1 && v < price) {
    return {
      valid: true,
      final: price - v,
      label: `−${new Intl.NumberFormat("ru-RU").format(v)} ₽`,
    };
  }
  return { valid: false, final: price, label: "" };
}

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

export const brandsOf = (list: Product[]) =>
  Array.from(new Set(list.map((p) => p.brand).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );

export const formatPrice = (n: number | null) =>
  n == null ? "Цена по запросу" : new Intl.NumberFormat("ru-RU").format(n) + " ₽";

// Русское склонение: plural(n, ["бренд","бренда","брендов"])
export const plural = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
};

export const totalProducts = (categoriesData as { count: number }[]).reduce(
  (s, c) => s + c.count,
  0
);
