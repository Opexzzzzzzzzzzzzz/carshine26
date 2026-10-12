// Бейдж скидки в углу фото товара («−15%» / «−500 ₽»).
export default function DiscountBadge({ label, size = "sm" }: { label: string; size?: "sm" | "lg" }) {
  return (
    <span
      className={`pointer-events-none absolute left-3 top-3 z-10 rounded-lg bg-danger font-bold text-white shadow-[0_6px_20px_-6px_rgba(255,93,93,0.7)] ${
        size === "lg" ? "px-3 py-1.5 text-base" : "px-2 py-1 text-xs"
      }`}
    >
      {label}
    </span>
  );
}
