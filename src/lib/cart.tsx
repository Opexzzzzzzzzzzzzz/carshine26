"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { formatPrice, productBySlug } from "./shop";

export type CartLine = { slug: string; qty: number };

type State = { lines: CartLine[] };
type Action =
  | { type: "add"; slug: string; qty?: number }
  | { type: "remove"; slug: string }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.slug === action.slug);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.slug === action.slug ? { ...l, qty: l.qty + (action.qty ?? 1) } : l
          ),
        };
      }
      return { lines: [...state.lines, { slug: action.slug, qty: action.qty ?? 1 }] };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.slug !== action.slug) };
    case "setQty":
      return {
        lines: state.lines
          .map((l) => (l.slug === action.slug ? { ...l, qty: action.qty } : l))
          .filter((l) => l.qty > 0),
      };
    case "clear":
      return { lines: [] };
    case "hydrate":
      return { lines: action.lines };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "carshine_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((s, l) => s + l.qty, 0);
    const total = state.lines.reduce((s, l) => {
      const p = productBySlug(l.slug);
      return s + (p && p.price ? p.price * l.qty : 0);
    }, 0);
    return {
      lines: state.lines,
      count,
      total,
      add: (slug, qty) => {
        dispatch({ type: "add", slug, qty });
        setOpen(true);
      },
      remove: (slug) => dispatch({ type: "remove", slug }),
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      clear: () => dispatch({ type: "clear" }),
      open,
      setOpen,
    };
  }, [state.lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { formatPrice };
