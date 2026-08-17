import type { MetadataRoute } from "next";
import { groups, products } from "@/lib/shop";

const base = "https://carshine26.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, priority: 1 },
    { url: `${base}/catalog`, priority: 0.9 },
    { url: `${base}/about`, priority: 0.4 },
    { url: `${base}/contacts`, priority: 0.4 },
    ...groups.map((g) => ({ url: `${base}/catalog/${g.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, priority: 0.6 })),
  ];
}
