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
  redirect("/admin/products?saved=1");
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
  redirect("/admin/products?deleted=1");
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
}

export async function deleteOrder(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
