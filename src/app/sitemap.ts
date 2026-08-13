import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";

const base = "https://carshine26.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, priority: 1 },
    { url: `${base}/catalog`, priority: 0.9 },
    ...categories.map((c) => ({
      url: `${base}/catalog/${c.slug}`,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      priority: 0.6,
    })),
  ];
}
