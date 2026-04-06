"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  bg: string;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: number, size: string, color: string) => void;
  update: (id: number, size: string, color: string, qty: number) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<CartCtx>({
  items: [], add: () => {}, remove: () => {}, update: () => {}, clear: () => {}, count: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("voxe_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("voxe_cart", JSON.stringify(items));
  }, [items]);

  const key = (id: number, size: string, color: string) => `${id}-${size}-${color}`;

  const add = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const k = key(item.id, item.size, item.color);
      const exists = prev.find((i) => key(i.id, i.size, i.color) === k);
      if (exists) return prev.map((i) => key(i.id, i.size, i.color) === k ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((id: number, size: string, color: string) => {
    setItems((prev) => prev.filter((i) => key(i.id, i.size, i.color) !== key(id, size, color)));
  }, []);

  const update = useCallback((id: number, size: string, color: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => key(i.id, i.size, i.color) === key(id, size, color) ? { ...i, quantity: qty } : i));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <Ctx.Provider value={{ items, add, remove, update, clear, count }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
