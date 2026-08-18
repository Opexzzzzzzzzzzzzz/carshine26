// Иконка категории на Google Material Symbols (шрифт подключён в layout).
export default function CategoryIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      aria-hidden
      translate="no"
    >
      {name}
    </span>
  );
}
