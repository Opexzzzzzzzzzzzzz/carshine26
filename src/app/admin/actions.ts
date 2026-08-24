"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

function toPrice(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  const n = Math.round(Number(s));
  if (!Number.isFinite(n)) return null;
  // Не выходить за пределы INT-колонки (иначе чтение из БД падает). Макс 2 млрд.
  return Math.min(Math.max(0, n), 2_000_000_000);
}

// Массив фото из формы (скрытое поле `photos` — JSON-массив URL).
// Возвращает главное фото (первое) и JSON всего массива.
function readPhotos(formData: FormData): { photo: string; photosJson: string } {
  let list: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("photos") || "[]"));
    if (Array.isArray(parsed)) list = parsed.map((x) => String(x).trim()).filter(Boolean);
  } catch {}
  return { photo: list[0] || "", photosJson: JSON.stringify(list) };
}

export async function updateProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  const { photo, photosJson } = readPhotos(formData);
  await prisma.product.update({
    where: { id },
    data: {
      title: String(formData.get("title") || "").trim(),
      brand: String(formData.get("brand") || "").trim(),
      price: toPrice(formData.get("price")),
      categorySlug: String(formData.get("categorySlug") || ""),
      description: String(formData.get("description") || "").trim(),
      photo,
      photosJson,
      inStock: formData.get("inStock") === "on",
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect(productsListUrl(formData, "saved=1"));
}

// Возврат на список товаров с сохранением фильтров (sort/q/page из поля back).
function productsListUrl(formData: FormData, extra: string): string {
  const back = String(formData.get("back") || "");
  const qs = [back, extra].filter(Boolean).join("&");
  return `/admin/products${qs ? `?${qs}` : ""}`;
}

export async function toggleStock(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  const p = await prisma.product.findUnique({ where: { id }, select: { inStock: true } });
  if (p) await prisma.product.update({ where: { id }, data: { inStock: !p.inStock } });
  revalidatePath("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect(productsListUrl(formData, "deleted=1"));
}

export async function createProduct(formData: FormData) {
  await requireAuth();
  const id = "m" + Date.now().toString(36);
  const { photo, photosJson } = readPhotos(formData);
  await prisma.product.create({
    data: {
      id,
      slug: id,
      title: String(formData.get("title") || "").trim() || "Без названия",
      brand: String(formData.get("brand") || "").trim(),
      price: toPrice(formData.get("price")),
      categorySlug: String(formData.get("categorySlug") || "prochee"),
      description: String(formData.get("description") || "").trim(),
      photo,
      photosJson,
      inStock: formData.get("inStock") === "on",
    },
  });
  revalidatePath("/admin/products");
  redirect(`/admin/products/${id}?created=1`);
}

export async function setOrderStatus(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "new");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders?saved=1");
}

export async function deleteOrder(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders?deleted=1");
}

type OrderItem = { title: string; qty: number; price: number | null; sum: number };

export async function updateOrder(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));

  // Позиции приходят JSON-массивом из редактора; чистим и пересчитываем суммы.
  let items: OrderItem[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("items") || "[]"));
    if (Array.isArray(parsed)) {
      items = parsed
        .map((it): OrderItem => {
          const title = String(it.title ?? "").trim();
          const qty = Math.max(1, Math.round(Number(it.qty) || 1));
          const priceRaw = it.price;
          const price =
            priceRaw === null || priceRaw === "" || priceRaw === undefined
              ? null
              : Math.max(0, Math.round(Number(priceRaw) || 0));
          return { title, qty, price, sum: (price ?? 0) * qty };
        })
        .filter((it) => it.title);
    }
  } catch {}

  const total = items.reduce((s, it) => s + it.sum, 0);

  await prisma.order.update({
    where: { id },
    data: {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      promo: String(formData.get("promo") || "").trim(),
      status: String(formData.get("status") || "new"),
      itemsJson: JSON.stringify(items),
      total,
    },
  });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders?saved=1");
}
