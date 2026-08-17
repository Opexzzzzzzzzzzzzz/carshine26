import raw from "@/data/catalog.json";

// ---- Типы ----
export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number | null;
  category: string; // slug категории
  categoryName: string;
  description: string;
  photo: string;
  photos: string[];
  inStock: boolean;
};

export type Category = {
  slug: string;
  title: string;
  count: number;
  group: string; // slug группы
};

export type Group = {
  slug: string;
  title: string;
  icon: string;
  categorySlugs: string[];
};

// ---- Группировка категорий в разделы меню (как на carshine26.ru) ----
export const groups: Group[] = [
  {
    slug: "polirovka",
    title: "Полировка",
    icon: "✨",
    categorySlugs: [
      "abrazivnye-pasty-dlya-lkp",
      "polirovalnye-krugi-i-pady",
      "podlozhki-k-polirovalnikam",
      "sostavy-dlya-polirovki",
      "polirovka-stekol",
    ],
  },
  {
    slug: "moyka-i-uhod",
    title: "Мойка и уход",
    icon: "🧴",
    categorySlugs: [
      "shampuny-ruchnoy-moyki",
      "beskontaktnye-shampuny",
      "osushiteli-kuzova",
      "dolgovremennaya-zasshita-kuzova",
      "voski-poliroli-silanty-glejzy",
      "antidozhd",
      "ochestiteli-diskov-reziny-chroma",
      "ochistiteli-bituma-smol-kleya",
      "ochestiteli-motornogo-otseka",
      "sostavy-dlya-ochistki-kuzova",
      "sredstva-obsshej-khimchistki",
      "sredstva-dlya-kozhi",
      "sredstva-dlya-stekol",
      "ukhod-za-vinilom-i-plastikom",
      "ukhod-za-rezinoj-i-plastikom",
      "aromatizatory-i-avtoparfyum",
      "pyatnovyvoditeli-salona",
      "dymovye-shashki",
    ],
  },
  {
    slug: "aksessuary",
    title: "Аксессуары",
    icon: "🧽",
    categorySlugs: [
      "protirochnyj-material",
      "sshetki-i-kisti",
      "gubki-applikatory-rukavicy",
      "raspryskivateli-i-triggery",
      "butylki-emkosti-vedra",
      "avtoskraby-abrazivnye-mat-ly",
      "sredstva-individualnoj-zasshity",
      "ukryvochnye-materialy",
    ],
  },
  {
    slug: "oborudovanie",
    title: "Оборудование",
    icon: "⚙️",
    categorySlugs: [
      "polirovalnye-mashinki",
      "turbosushki-tornadory-ozonatory",
      "drugoe-oborudovanye",
    ],
  },
  {
    slug: "plenka-i-instrumenti",
    title: "Плёнка и инструменты",
    icon: "🎞️",
    categorySlugs: ["plenka-i-instrumenti", "sostavy-dlya-plenok"],
  },
  {
    slug: "nabori",
    title: "Наборы",
    icon: "🎁",
    categorySlugs: ["nabori"],
  },
];

// ---- Индексы категорий ----
const groupByCategory: Record<string, string> = {};
for (const g of groups) for (const c of g.categorySlugs) groupByCategory[c] = g.slug;

export const categories: Category[] = (
  raw.categories as { slug: string; title: string; count: number }[]
).map((c) => ({ ...c, group: groupByCategory[c.slug] ?? "prochee" }));

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

// slug товара из url (…/tproduct/{id}-{slug}) либо из id
function productSlug(id: string, url: string): string {
  const m = /\/tproduct\/\d+-([^/?#]+)/.exec(url || "");
  return m ? m[1] : id;
}

export const products: Product[] = (
  raw.products as Array<{
    id: string;
    title: string;
    brand: string;
    price: number | null;
    category: string;
    categoryName: string;
    description: string;
    photo: string;
    photos: string[];
    url: string;
    inStock: boolean;
  }>
).map((p) => ({
  id: p.id,
  slug: productSlug(p.id, p.url),
  title: p.title,
  brand: p.brand || "",
  price: p.price,
  category: p.category,
  categoryName: p.categoryName,
  description: p.description || "",
  photo: p.photo || "",
  photos: p.photos && p.photos.length ? p.photos : p.photo ? [p.photo] : [],
  inStock: p.inStock !== false,
}));

const productBySlugMap = new Map(products.map((p) => [p.slug, p]));
const productByIdMap = new Map(products.map((p) => [p.id, p]));

// ---- Хелперы ----
export const categoryBySlug = (slug: string) => categoryMap.get(slug);
export const groupBySlug = (slug: string) => groups.find((g) => g.slug === slug);
export const categoriesOfGroup = (groupSlug: string) =>
  categories.filter((c) => c.group === groupSlug);

export const productBySlug = (slug: string) =>
  productBySlugMap.get(slug) ?? productByIdMap.get(slug);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const productsByGroup = (groupSlug: string) => {
  const set = new Set(groupBySlug(groupSlug)?.categorySlugs ?? []);
  return products.filter((p) => set.has(p.category));
};

export const brandsOf = (list: Product[]) =>
  Array.from(new Set(list.map((p) => p.brand).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "ru")
  );

export const allBrands = brandsOf(products);

export const searchProducts = (q: string, limit = 60) => {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return products
    .filter(
      (p) =>
        p.title.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)
    )
    .slice(0, limit);
};

export const relatedProducts = (p: Product, limit = 6) =>
  products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, limit);

// Витрина на главной: по несколько популярных позиций из ключевых категорий
export const featuredProducts = (limit = 12) => {
  const picks: Product[] = [];
  const seenBrand = new Set<string>();
  for (const p of products) {
    if (!p.photo || p.price == null) continue;
    if (seenBrand.has(p.brand)) continue;
    seenBrand.add(p.brand);
    picks.push(p);
    if (picks.length >= limit) break;
  }
  return picks;
};

export const formatPrice = (n: number | null) =>
  n == null ? "Цена по запросу" : new Intl.NumberFormat("ru-RU").format(n) + " ₽";

export const totalProducts = products.length;

// Облегчённая версия для списков (без описания и лишних фото) —
// уменьшает объём данных, уезжающих в клиентские компоненты.
export const toLite = (list: Product[]): Product[] =>
  list.map((p) => ({ ...p, description: "", photos: p.photo ? [p.photo] : [] }));

export const allProductsLite = () => toLite(products);
export const productsByGroupLite = (g: string) => toLite(productsByGroup(g));
export const productsByCategoryLite = (c: string) => toLite(productsByCategory(c));
