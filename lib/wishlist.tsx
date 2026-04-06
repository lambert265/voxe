"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface WishlistCtx {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  count: number;
}

const Ctx = createContext<WishlistCtx>({ ids: [], toggle: () => {}, has: () => false, count: 0 });

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("voxe_wishlist");
      if (stored) setIds(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("voxe_wishlist", JSON.stringify(ids));
  }, [ids]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const has = useCallback((id: number) => ids.includes(id), [ids]);

  return <Ctx.Provider value={{ ids, toggle, has, count: ids.length }}>{children}</Ctx.Provider>;
}

export const useWishlist = () => useContext(Ctx);
