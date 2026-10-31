import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

export interface CartLine {
  productId: string;
  merchantId: string;
  storeName: string;
  title: string;
  rate: number;
  coverImage?: string;
  deliveryChargeGujarat: number;
  deliveryChargeOther: number;
  stock: number;
  qty: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  deliveryFor: (state: string) => number;
  byMerchant: () => Record<string, CartLine[]>;
}

const KEY = "ps_cart_v1";
const CartContext = createContext<CartCtx | null>(null);

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => read());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const byMerchant = () =>
      lines.reduce<Record<string, CartLine[]>>((acc, l) => {
        (acc[l.merchantId] ||= []).push(l);
        return acc;
      }, {});

    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.rate, 0),
      add: (p, qty = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.productId === p.$id);
          if (existing) {
            return prev.map((l) =>
              l.productId === p.$id
                ? { ...l, qty: Math.min(l.qty + qty, Math.max(p.stock, 1)) }
                : l,
            );
          }
          return [
            ...prev,
            {
              productId: p.$id,
              merchantId: p.merchantId,
              storeName: p.storeName,
              title: p.title,
              rate: p.rate,
              coverImage: p.coverImage,
              deliveryChargeGujarat: p.deliveryChargeGujarat,
              deliveryChargeOther: p.deliveryChargeOther,
              stock: p.stock,
              qty: Math.min(qty, Math.max(p.stock, 1)),
            },
          ];
        }),
      setQty: (productId, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.productId !== productId)
            : prev.map((l) =>
                l.productId === productId
                  ? { ...l, qty: Math.min(qty, Math.max(l.stock, 1)) }
                  : l,
              ),
        ),
      remove: (productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
      clear: () => setLines([]),
      // Delivery is charged once per merchant, using the highest per-merchant charge.
      deliveryFor: (state: string) => {
        const gujarat = (state || "").trim().toLowerCase() === "gujarat";
        const groups = lines.reduce<Record<string, CartLine[]>>((acc, l) => {
          (acc[l.merchantId] ||= []).push(l);
          return acc;
        }, {});
        return Object.values(groups).reduce(
          (sum, g) =>
            sum +
            Math.max(...g.map((l) => (gujarat ? l.deliveryChargeGujarat : l.deliveryChargeOther))),
          0,
        );
      },
      byMerchant,
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
