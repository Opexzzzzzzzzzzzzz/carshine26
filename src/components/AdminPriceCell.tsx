"use client";

import { useRef, useState, useTransition } from "react";
import { computeDiscount, formatPrice } from "@/lib/shop";
import { updateProductPrice } from "@/app/admin/actions";

type Values = { price: number | null; discountType: string; discountValue: number; onSale: boolean };

// Цена в списке товаров админки с редактированием на месте.
// Клик по цене → поле; Enter / клик мимо — сохранить, Esc — отмена.
// Редактируется базовая цена (до скидки); скидка пересчитывается автоматически.
export default function AdminPriceCell({ id, ...initial }: Values & { id: string }) {
  const [v, setV] = useState<Values>(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState<"" | "saved" | "reset">("");
  const [pending, startTransition] = useTransition();
  const busy = useRef(false);
  const skipBlur = useRef(false);

  const d = computeDiscount(v.price, v.discountType, v.discountValue);

  const begin = () => {
    setDraft(v.price == null ? "" : String(v.price));
    setError("");
    setNote("");
    skipBlur.current = false;
    setEditing(true);
  };

  const cancel = () => {
    skipBlur.current = true;
    setEditing(false);
    setError("");
  };

  const save = () => {
    if (busy.current || skipBlur.current) return;
    const raw = draft.trim();
    if (raw.replace(/\s/g, "") === (v.price == null ? "" : String(v.price))) {
      setEditing(false);
      return;
    }
    busy.current = true;
    startTransition(async () => {
      try {
        const r = await updateProductPrice(id, raw);
        if (!r.ok) {
          setError(r.error);
          return;
        }
        setV({ price: r.price, discountType: r.discountType, discountValue: r.discountValue, onSale: r.onSale });
        skipBlur.current = true;
        setEditing(false);
        setNote(r.discountReset ? "reset" : "saved");
        setTimeout(() => setNote(""), r.discountReset ? 4000 : 1500);
      } catch {
        setError("Не удалось сохранить");
      } finally {
        busy.current = false;
      }
    });
  };

  if (editing) {
    return (
      <div className="min-w-[8.5rem]">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-gold bg-bg pr-2 ring-1 ring-gold/25">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  save();
                }
                if (e.key === "Escape") cancel();
              }}
              onBlur={save}
              disabled={pending}
              inputMode="numeric"
              placeholder="по запросу"
              aria-label="Цена, ₽"
              className="w-24 bg-transparent px-2 py-1.5 text-sm tabular-nums outline-none placeholder:text-fg-dim disabled:opacity-50"
            />
            <span className="text-xs text-fg-dim">₽</span>
          </div>
          {pending && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold" aria-label="Сохранение" />
          )}
        </div>
        {d.valid && !error && <div className="mt-1 text-[11px] text-fg-dim">цена до скидки ({d.label})</div>}
        {error && <div className="mt-1 text-[11px] text-danger">{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={begin}
        title="Изменить цену"
        className="group/price -mx-1.5 inline-flex items-start gap-1.5 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface"
      >
        <span>
          {d.valid ? (
            <>
              <span className="block font-medium text-danger">{formatPrice(d.final)}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-fg-dim line-through">{formatPrice(v.price)}</span>
                <span className="rounded bg-danger/15 px-1.5 text-danger">{d.label}</span>
                {v.onSale && <span className="rounded bg-gold/15 px-1.5 text-gold">распродажа</span>}
              </span>
            </>
          ) : (
            <span className="block font-medium">{formatPrice(v.price)}</span>
          )}
        </span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mt-1 shrink-0 text-fg-dim opacity-0 transition-opacity group-hover/price:opacity-100"
          aria-hidden
        >
          <path d="M4 20h4L19 9l-4-4L4 16v4Z" strokeLinejoin="round" />
          <path d="m13.5 6.5 4 4" />
        </svg>
      </button>
      {note === "saved" && <div className="text-[11px] text-success">✓ сохранено</div>}
      {note === "reset" && <div className="text-[11px] text-danger">скидка сброшена — не подходит к новой цене</div>}
    </div>
  );
}
