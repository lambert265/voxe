"use client";
import {
  createContext, useContext, useEffect, useState, useCallback, useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  add: (item: Omit<CartItem, "quantity">) => Promise<void>;
  remove: (id: number, size: string, color: string) => Promise<void>;
  update: (id: number, size: string, color: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  count: number;
  loading: boolean;
}

const Ctx = createContext<CartCtx>({
  items: [], add: async () => {}, remove: async () => {},
  update: async () => {}, clear: async () => {}, count: 0, loading: false,
});

const LS_KEY = "voxe_cart";
const itemKey = (id: number, size: string, color: string) => `${id}-${size}-${color}`;

// ── localStorage helpers ──────────────────────────────────────────────────────
function lsGet(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}
function lsSet(items: CartItem[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
}
function lsClear() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

// ── Supabase row → CartItem ───────────────────────────────────────────────────
function rowToItem(row: Record<string, unknown>): CartItem {
  return {
    id: row.product_id as number,
    name: row.name as string,
    price: row.price as number,
    size: row.size as string,
    color: row.color as string,
    bg: (row.bg as string) ?? "",
    quantity: row.quantity as number,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Fetch from Supabase ─────────────────────────────────────────────────────
  const fetchRemote = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", uid)
      .order("created_at");
    if (data) setItems(data.map(rowToItem));
  }, []);

  // ── Migrate localStorage → Supabase on sign-in ──────────────────────────────
  const migrateLocal = useCallback(async (uid: string) => {
    const local = lsGet();
    if (local.length === 0) return;
    const rows = local.map((i) => ({
      user_id: uid,
      product_id: i.id,
      name: i.name,
      price: i.price,
      size: i.size,
      color: i.color,
      bg: i.bg,
      quantity: i.quantity,
    }));
    // upsert — if item already exists in DB, increment quantity
    for (const row of rows) {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", uid)
        .eq("product_id", row.product_id)
        .eq("size", row.size)
        .eq("color", row.color)
        .single();

      if (existing) {
        await supabase.from("cart_items")
          .update({ quantity: existing.quantity + row.quantity, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert(row);
      }
    }
    lsClear();
  }, []);

  // ── Subscribe to real-time changes ──────────────────────────────────────────
  const subscribeRealtime = useCallback((uid: string) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase
      .channel(`cart:${uid}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "cart_items",
        filter: `user_id=eq.${uid}`,
      }, () => fetchRemote(uid))
      .subscribe();
  }, [fetchRemote]);

  // ── Auth state listener ─────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        await migrateLocal(u.id);
        await fetchRemote(u.id);
        subscribeRealtime(u.id);
      } else {
        setItems(lsGet());
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        await migrateLocal(u.id);
        await fetchRemote(u.id);
        subscribeRealtime(u.id);
      } else {
        // signed out — save remote cart to localStorage then clear state
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        setItems([]);
        lsClear();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  // ── Persist to localStorage when guest ─────────────────────────────────────
  useEffect(() => {
    if (!user) lsSet(items);
  }, [items, user]);

  // ── Cart operations ─────────────────────────────────────────────────────────
  const add = useCallback(async (item: Omit<CartItem, "quantity">) => {
    if (!user) {
      // Guest — localStorage only
      setItems((prev) => {
        const k = itemKey(item.id, item.size, item.color);
        const exists = prev.find((i) => itemKey(i.id, i.size, i.color) === k);
        return exists
          ? prev.map((i) => itemKey(i.id, i.size, i.color) === k ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev, { ...item, quantity: 1 }];
      });
      return;
    }

    // Signed in — Supabase
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", item.id)
      .eq("size", item.size)
      .eq("color", item.color)
      .single();

    if (existing) {
      await supabase.from("cart_items")
        .update({ quantity: existing.quantity + 1, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        bg: item.bg,
        quantity: 1,
      });
    }
    await fetchRemote(user.id);
  }, [user, fetchRemote]);

  const remove = useCallback(async (id: number, size: string, color: string) => {
    if (!user) {
      setItems((prev) => prev.filter((i) => itemKey(i.id, i.size, i.color) !== itemKey(id, size, color)));
      return;
    }
    await supabase.from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", id)
      .eq("size", size)
      .eq("color", color);
    await fetchRemote(user.id);
  }, [user, fetchRemote]);

  const update = useCallback(async (id: number, size: string, color: string, qty: number) => {
    if (qty < 1) { await remove(id, size, color); return; }

    if (!user) {
      setItems((prev) => prev.map((i) =>
        itemKey(i.id, i.size, i.color) === itemKey(id, size, color) ? { ...i, quantity: qty } : i
      ));
      return;
    }
    await supabase.from("cart_items")
      .update({ quantity: qty, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("product_id", id)
      .eq("size", size)
      .eq("color", color);
    await fetchRemote(user.id);
  }, [user, remove, fetchRemote]);

  const clear = useCallback(async () => {
    if (!user) { setItems([]); lsClear(); return; }
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  }, [user]);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, update, clear, count, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
