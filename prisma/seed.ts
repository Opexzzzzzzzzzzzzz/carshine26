import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { groupByCategory } from "../src/lib/groups";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

type RawProduct = {
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
};
type Catalog = {
  categories: { slug: string; title: string; count: number }[];
  products: RawProduct[];
};

function slugOf(id: string, url: string): string {
  const m = /\/tproduct\/\d+-([^/?#]+)/.exec(url || "");
  return m ? m[1] : id;
}

async function main() {
  const catalog: Catalog = JSON.parse(
    readFileSync(join(__dirname, "../data/catalog.json"), "utf-8")
  );

  console.log("Очистка таблиц…");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log(`Категории: ${catalog.categories.length}`);
  await prisma.category.createMany({
    data: catalog.categories.map((c) => ({
      slug: c.slug,
      title: c.title,
      group: groupByCategory[c.slug] ?? "prochee",
    })),
  });

  const seen = new Set<string>();
  const rows = catalog.products.map((p) => {
    let slug = slugOf(p.id, p.url);
    if (seen.has(slug)) slug = `${slug}-${p.id}`;
    seen.add(slug);
    return {
      id: p.id,
      slug,
      title: p.title,
      brand: p.brand || "",
      price: p.price ?? null,
      categorySlug: p.category,
      description: p.description || "",
      photo: p.photo || "",
      photosJson: JSON.stringify(p.photos && p.photos.length ? p.photos : p.photo ? [p.photo] : []),
      inStock: p.inStock !== false,
    };
  });

  console.log(`Товары: ${rows.length}`);
  const CHUNK = 300;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await prisma.product.createMany({ data: rows.slice(i, i + CHUNK) });
    console.log(`  ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }

  const pc = await prisma.product.count();
  const cc = await prisma.category.count();
  console.log(`Готово: ${pc} товаров, ${cc} категорий`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
