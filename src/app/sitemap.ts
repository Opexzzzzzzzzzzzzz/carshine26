import type { MetadataRoute } from "next";
import { groups } from "@/lib/shop";
import { prisma } from "@/lib/db";

const base = "https://carshine26.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return [
    { url: base, priority: 1 },
    { url: `${base}/catalog`, priority: 0.9 },
    { url: `${base}/about`, priority: 0.4 },
    { url: `${base}/contacts`, priority: 0.4 },
    ...groups.map((g) => ({ url: `${base}/catalog/${g.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, priority: 0.6 })),
  ];
}
