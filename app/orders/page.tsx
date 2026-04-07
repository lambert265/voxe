"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { formatNGN } from "@/lib/products";

const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Pending:    "bg-linen-cream/8 text-linen-cream/40 border-linen-cream/12",
  Cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
};

type OrderItem = { name: string; size: string; color: string; quantity: number; price: number };
type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: OrderItem[];
  delivery_address: string;
};

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="border border-amber-tan/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-amber-tan/3 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-amber-tan/10 border border-amber-tan/20 flex items-center justify-center shrink-0">
            <Package size={16} className="text-amber-tan" />
          </div>
          <div className="text-left min-w-0">
            <p className="font-dm text-xs text-amber-tan font-semibold tracking-wider">
              VXE-{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-dm text-xs text-linen-cream/35 mt-0.5">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className={`font-dm text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.Pending}`}>
            {order.status}
          </span>
          <span className="font-dm text-sm font-semibold text-linen-cream">{formatNGN(order.total)}</span>
          {expanded ? <ChevronUp size={14} className="text-linen-cream/30" /> : <ChevronDown size={14} className="text-linen-cream/30" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-amber-tan/10 px-5 py-4 space-y-3 bg-amber-tan/2">
          {(order.items ?? []).map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-dm text-sm text-linen-cream">{item.name}</p>
                <p className="font-dm text-xs text-linen-cream/35 mt-0.5">
                  Size {item.size} · {item.color} · ×{item.quantity}
                </p>
              </div>
              <p className="font-dm text-sm text-amber-tan">{formatNGN(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="pt-3 border-t border-amber-tan/8 flex items-center justify-between">
            <p className="font-dm text-xs text-linen-cream/35">{order.delivery_address}</p>
            <Link href={`/track-order?id=VXE-${order.id.slice(0, 8).toUpperCase()}`}
              className="font-dm text-xs text-amber-tan hover:underline flex items-center gap-1">
              Track <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) { router.replace("/auth"); return; }
    if (!user) return;
    supabase
      .from("orders")
      .select("id, created_at, total, status, items, delivery_address")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setFetching(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-[68px]">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.35em] mb-2">Account</p>
          <h1 className="font-playfair text-4xl text-linen-cream mb-10">My Orders</h1>

          {fetching || loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-amber-tan/5 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24">
              <Package size={48} className="text-amber-tan/20 mx-auto mb-4" />
              <p className="font-playfair text-2xl text-linen-cream/30 mb-2">No orders yet</p>
              <p className="font-dm text-sm text-linen-cream/20 mb-8">Your orders will appear here once you shop.</p>
              <Link href="/shop"
                className="btn-amber sheen inline-flex items-center gap-2 px-8 py-3.5 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
                Start Shopping <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => <OrderRow key={order.id} order={order} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
