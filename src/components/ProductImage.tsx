import type { Product } from "@/lib/catalog";

// Брендовая заглушка вместо фото (на прототипе фото нет).
// На MVP заменяется на next/image с реальными снимками товара.
const brandStyle: Record<string, { from: string; to: string; mark: string }> = {
  "Koch Chemie": { from: "#1f2a44", to: "#0c1120", mark: "KC" },
  "Shine Systems": { from: "#3a2a12", to: "#140d05", mark: "SS" },
  POLYTOP: { from: "#2a1f3a", to: "#120a1c", mark: "PT" },
  CarShine: { from: "#123033", to: "#06171a", mark: "CS" },
};

export default function ProductImage({
  product,
  className = "",
  compact = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
}) {
  const b = brandStyle[product.brand] ?? brandStyle.CarShine;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, ${b.from}, ${b.to})`,
      }}
      aria-hidden
    >
      {/* глянцевый блик */}
      <div className="absolute inset-0 gloss" />
      <div
        className="absolute left-1/2 top-1/2 h-[62%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-[14px] rounded-t-[40px]"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "inset 0 20px 40px rgba(255,255,255,0.06)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-display font-semibold tracking-wide text-white/85 ${
            compact ? "text-xl" : "text-3xl"
          }`}
        >
          {b.mark}
        </span>
      </div>
      {product.brand && (
        <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-widest text-white/45">
          {product.brand}
        </span>
      )}
    </div>
  );
}
