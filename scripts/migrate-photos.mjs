// Перенос фото товаров с внешнего CDN (tildacdn) на свой сервер.
//
//   cd /opt/carshine && node scripts/migrate-photos.mjs            # перенести всё
//   node scripts/migrate-photos.mjs --limit 20                      # проба на 20 товарах
//   node scripts/migrate-photos.mjs --rollback                      # вернуть старые ссылки
//
// Фото скачиваются, конвертируются в WebP (не больше 1200 px), кладутся в
// public/uploads/catalog/ (их раздаёт nginx), ссылки в БД меняются на локальные.
// Старые ссылки сохраняются в prisma/photo-migration-backup.json — для отката.
// Повторный запуск безопасен: готовые файлы и уже перенесённые товары пропускаются.
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();
const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "uploads", "catalog");
const BACKUP = join(ROOT, "prisma", "photo-migration-backup.json");
const PUBLIC_PREFIX = "/uploads/catalog/";
const MAX_SIDE = 1200;
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg >= 0 ? Number(args[limitArg + 1]) || 0 : 0;

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("! sharp недоступен — фото сохранятся без конвертации в WebP");
}

const isRemote = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const parseList = (s) => {
  try {
    const v = JSON.parse(s || "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

async function rollback() {
  if (!existsSync(BACKUP)) {
    console.log("Нет файла бэкапа — откатывать нечего.");
    return;
  }
  const backup = JSON.parse(readFileSync(BACKUP, "utf8"));
  let n = 0;
  for (const [id, old] of Object.entries(backup)) {
    await prisma.product.update({ where: { id }, data: { photo: old.photo, photosJson: old.photosJson } }).catch(() => {});
    n++;
  }
  console.log(`Откат: восстановлены ссылки у ${n} товаров. Файлы в public/uploads/catalog не удалялись.`);
}

async function download(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

// Скачивает фото (если ещё нет файла) и возвращает локальный путь.
async function localize(url) {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 20);
  const origExt = (url.split("?")[0].match(/\.(jpe?g|png|webp|gif)$/i)?.[1] || "jpg").toLowerCase();
  const ext = sharp ? "webp" : origExt;
  const name = `${hash}.${ext}`;
  const file = join(OUT_DIR, name);
  if (!existsSync(file)) {
    const buf = await download(url);
    if (sharp) {
      const out = await sharp(buf, { animated: false })
        .rotate()
        .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      writeFileSync(file, out);
    } else {
      writeFileSync(file, buf);
    }
  }
  return PUBLIC_PREFIX + name;
}

async function migrate() {
  mkdirSync(OUT_DIR, { recursive: true });
  const all = await prisma.product.findMany({ select: { id: true, photo: true, photosJson: true } });
  let todo = all.filter((p) => isRemote(p.photo) || parseList(p.photosJson).some(isRemote));
  if (LIMIT) todo = todo.slice(0, LIMIT);
  console.log(`Товаров с внешними фото: ${todo.length}${LIMIT ? " (ограничение --limit)" : ""}`);

  // Бэкап старых ссылок (дописываем, не перезаписывая уже сохранённые).
  const backup = existsSync(BACKUP) ? JSON.parse(readFileSync(BACKUP, "utf8")) : {};
  for (const p of todo) if (!backup[p.id]) backup[p.id] = { photo: p.photo, photosJson: p.photosJson };
  writeFileSync(BACKUP, JSON.stringify(backup));

  const urls = [...new Set(todo.flatMap((p) => [p.photo, ...parseList(p.photosJson)]).filter(isRemote))];
  console.log(`Уникальных фото к загрузке: ${urls.length}`);

  const map = new Map();
  const failed = [];
  let done = 0;
  let next = 0;
  async function worker() {
    while (next < urls.length) {
      const url = urls[next++];
      try {
        map.set(url, await localize(url));
      } catch (e) {
        failed.push(url);
        console.warn(`  ✗ ${url} — ${e.message}`);
      }
      done++;
      if (done % 100 === 0 || done === urls.length) console.log(`  ${done}/${urls.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Меняем ссылки в БД. Фото, которые не скачались, остаются внешними.
  let updated = 0;
  for (const p of todo) {
    const swap = (u) => (isRemote(u) && map.has(u) ? map.get(u) : u);
    const photo = swap(p.photo);
    const photosJson = JSON.stringify(parseList(p.photosJson).map(swap));
    if (photo !== p.photo || photosJson !== p.photosJson) {
      await prisma.product.update({ where: { id: p.id }, data: { photo, photosJson } });
      updated++;
    }
  }

  console.log(`Готово. Обновлено товаров: ${updated}. Не скачалось фото: ${failed.length}.`);
  if (failed.length) console.log("Повторный запуск попробует скачать их снова.");
}

try {
  if (args.includes("--rollback")) await rollback();
  else await migrate();
} finally {
  await prisma.$disconnect();
}
