"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/lib/shop";

const sorted = [...categories].sort((a, b) => a.title.localeCompare(b.title, "ru"));

// Фильтр по категории для списка товаров в админке.
// При выборе переходит на /admin/products, сохраняя поиск и сортировку.
export default function AdminCategoryFilter({
  cat,
  q,
  sort,
}: {
  cat: string;
  q: string;
  sort: string;
}) {
  const router = useRouter();
  return (
    <select
      value={cat}
      onChange={(e) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (sort !== "title") params.set("sort", sort);
        if (e.target.value) params.set("cat", e.target.value);
        const qs = params.toString();
        router.push(`/admin/products${qs ? `?${qs}` : ""}`);
      }}
      className="max-w-[220px] rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-gold"
    >
      <option value="">Все категории</option>
      {sorted.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.title} ({c.count})
        </option>
      ))}
    </select>
  );
}
