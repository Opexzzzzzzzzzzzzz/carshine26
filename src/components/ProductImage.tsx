import Image from "next/image";

type ImgProduct = { photo: string; title: string; brand?: string };

const brandStyle: Record<string, { from: string; to: string; mark: string }> = {
  "Koch Chemie": { from: "#1f2a44", to: "#0c1120", mark: "KC" },
  "Shine Systems": { from: "#3a2a12", to: "#140d05", mark: "SS" },
  POLYTOP: { from: "#2a1f3a", to: "#120a1c", mark: "PT" },
  CarShine: { from: "#123033", to: "#06171a", mark: "CS" },
};

function initials(brand: string) {
  if (!brand) return "CS";
  const parts = brand.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "C") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "");
}

export default function ProductImage({
  product,
  className = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
}: {
  product: ImgProduct;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (product.photo) {
    const isLocal = product.photo.startsWith("/"); // загруженные с компа фото
    return (
      <div className={`relative overflow-hidden bg-[#f4f4f2] ${className}`}>
        <Image
          src={product.photo}
          alt={product.title}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={isLocal}
          className="object-contain p-3"
        />
      </div>
    );
  }

  // Фолбэк — брендовая заглушка (для товаров без фото)
  const brand = product.brand ?? "";
  const b = brandStyle[brand] ?? {
    from: "#20242c",
    to: "#0c0f13",
    mark: initials(brand).toUpperCase(),
  };
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 50% 0%, ${b.from}, ${b.to})` }}
      aria-hidden
    >
      <span className="font-display text-2xl font-semibold text-white/80">
        {b.mark}
      </span>
    </div>
  );
}
