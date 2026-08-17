"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateProductDescription } from "@/lib/ai";

function toPrice(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  const n = Math.round(Number(s));
  return Number.isFinite(n) ? n : null;
}

export async function updateProduct(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  const photo = String(formData.get("photo") || "");
  await prisma.product.update({
    where: { id },
    data: {
      title: String(formData.get("title") || "").trim(),
      brand: String(formData.get("brand") || "").trim(),
      price: toPrice(formData.get("price")),
      categorySlug: String(formData.get("categorySlug") || ""),
      description: String(formData.get("description") || "").trim(),
      photo,
      photosJson: photo ? JSON.stringify([photo]) : "[]",
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
  const photo = String(formData.get("photo") || "");
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
      photosJson: photo ? JSON.stringify([photo]) : "[]",
      inStock: formData.get("inStock") === "on",
    },
  });
  revalidatePath("/admin/products");
  redirect(`/admin/products/${id}?created=1`);
}

export async function aiDescribe(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return;
  const text = await generateProductDescription({
    title: p.title,
    brand: p.brand,
    category: p.categorySlug,
  });
  await prisma.product.update({ where: { id }, data: { description: text } });
  revalidatePath(`/admin/products/${id}`);
}

export async function setOrderStatus(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "new");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
