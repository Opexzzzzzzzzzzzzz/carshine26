"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartSnapshot } from "./shop";

type FavContextValue = {
  items: CartSnapshot[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (item: CartSnapshot) => void;
  remove: (slug: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const FavContext = createContext<FavContextValue | null>(null);
const KEY = "carshine_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartSnapshot[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<FavContextValue>(
    () => ({
      items,
      count: items.length,
      has: (slug) => items.some((i) => i.slug === slug),
      toggle: (item) =>
        setItems((prev) =>
          prev.some((i) => i.slug === item.slug)
            ? prev.filter((i) => i.slug !== item.slug)
            : [...prev, item]
        ),
      remove: (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug)),
      open,
      setOpen,
    }),
    [items, open]
  );

  return <FavContext.Provider value={value}>{children}</FavContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
