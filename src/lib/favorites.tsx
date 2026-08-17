"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FavContextValue = {
  ids: string[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const FavContext = createContext<FavContextValue | null>(null);
const KEY = "carshine_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  const value = useMemo<FavContextValue>(
    () => ({
      ids,
      count: ids.length,
      has: (slug) => ids.includes(slug),
      toggle: (slug) =>
        setIds((prev) =>
          prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]
        ),
      remove: (slug) => setIds((prev) => prev.filter((x) => x !== slug)),
      open,
      setOpen,
    }),
    [ids, open]
  );

  return <FavContext.Provider value={value}>{children}</FavContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
