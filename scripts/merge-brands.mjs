// Разовая миграция: объединяет дубли брендов (переименовывает товары).
// Запуск на сервере: cd /opt/carshine && node scripts/merge-brands.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// [из, в]
const MERGES = [
  ["LERATON", "Leraton"],
  ["Vintexx", "Vintex"],
];

for (const [from, to] of MERGES) {
  const r = await prisma.product.updateMany({ where: { brand: from }, data: { brand: to } });
  console.log(`${from} -> ${to}: переименовано ${r.count}`);
}

await prisma.$disconnect();
console.log("Готово.");
