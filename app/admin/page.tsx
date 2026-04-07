"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, AlertTriangle, RefreshCw } from "lucide-react";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Pending:    "bg-linen-cream/8 text-linen-cream/50 border-linen-cream/12",
  Cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
};

const PRODUCT_IMGS: Record<number, string> = {
  1:  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=80&q=70",
  2:  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&q=70",
  3:  "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=80&q=70",
  9:  "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=80&q=70",
  15: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=70",
};

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  total: number;
  status: string;
  payment_method: string;
  items: { id: number }[];
};

type Stats = {
  revenue: number;
  orders: number;
  customers: number;
};

export default function AdminOverview() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({ revenue: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);

    // Orders
    const { data: orders } = await supabase
      .from("orders")
      .select("id, created_at, customer_name, total, status, payment_method, items")
      .order("created_at", { ascending: false });

    if (orders) {
      const revenue = orders.reduce((s: number, o: Order) => s + (o.total ?? 0), 0);
      setStats({
        revenue,
        orders: orders.length,
        customers: new Set(orders.map((o: Order) => o.customer_name)).size,
      });
      setRecentOrders(orders.slice(0, 5));
    }

    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function shortId(id: string) {
    return `VXE-${id.slice(0, 8).toUpperCase()}`;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  }

  const statCards = [
    { label: "Total Revenue",   value: formatNGN(stats.revenue), icon: TrendingUp,  sub: "all time"        },
    { label: "Total Orders",    value: String(stats.orders),     icon: ShoppingBag, sub: "all time"        },
    { label: "Customers",       value: String(stats.customers),  icon: Users,       sub: "unique customers" },
    { label: "Active Products", value: String(ALL_PRODUCTS.length), icon: Package,  sub: "in catalogue"    },
  ];

  const topProducts = ALL_PRODUCTS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="card-gloss rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest">{label}</span>
              <div className="w-8 h-8 rounded-lg bg-amber-tan/10 border border-amber-tan/20 flex items-center justify-center">
                <Icon size={14} className="text-amber-tan" />
              </div>
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-24 bg-amber-tan/10 rounded animate-pulse" />
              ) : (
                <p className="font-dm text-3xl text-linen-cream leading-none">{value}</p>
              )}
              <div className="flex items-center justify-between mt-1.5">
                <span className="flex items-center gap-0.5 font-dm text-xs text-emerald-400">
                  <ArrowUpRight size={12} /> Live
                </span>
                <span className="font-dm text-[10px] text-linen-cream/25">{sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 card-gloss rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-tan/10">
            <h3 className="font-dm text-lg text-linen-cream">Recent Orders</h3>
            <div className="flex items-center gap-3">
              <button onClick={fetchData} className="text-linen-cream/25 hover:text-amber-tan transition-colors">
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </button>
              <Link href="/admin/orders" className="font-dm text-xs text-amber-tan hover:underline">View all</Link>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-10 bg-amber-tan/5 rounded animate-pulse" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-dm text-sm text-linen-cream/25">No orders yet</p>
              <p className="font-dm text-xs text-linen-cream/15 mt-1">Orders will appear here once customers checkout</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-tan/8">
                    {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left font-dm text-[9px] text-linen-cream/25 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, i) => (
                    <tr key={o.id} className={`hover:bg-amber-tan/3 transition-colors cursor-pointer ${i < recentOrders.length - 1 ? "border-b border-amber-tan/6" : ""}`}>
                      <td className="px-5 py-3.5 font-dm text-xs text-amber-tan font-semibold">{shortId(o.id)}</td>
                      <td className="px-5 py-3.5 font-dm text-sm text-linen-cream">{o.customer_name}</td>
                      <td className="px-5 py-3.5 font-dm text-sm text-linen-cream font-medium">{formatNGN(o.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-dm text-[9px] tracking-wider uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[o.status] ?? STATUS_STYLES.Pending}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/30">{formatDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="card-gloss rounded-xl p-5">
          <h3 className="font-dm text-lg text-linen-cream mb-5">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="font-dm text-xs text-amber-tan/40 w-4 shrink-0">#{i + 1}</span>
                <div className="w-9 h-10 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                  {PRODUCT_IMGS[p.id] && (
                    <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={40} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-dm text-xs text-linen-cream truncate">{p.name}</p>
                  <p className="font-dm text-[10px] text-amber-tan">{formatNGN(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/products" className="mt-4 font-dm text-[10px] text-amber-tan hover:underline text-center block">
            Manage Products →
          </Link>
        </div>
      </div>

      {/* Low stock */}
      <div className="card-gloss rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={14} className="text-amber-tan" />
          <h3 className="font-dm text-sm font-semibold text-linen-cream">Low Stock Alerts</h3>
          <span className="font-dm text-[9px] text-amber-tan bg-amber-tan/10 border border-amber-tan/20 px-2 py-0.5 rounded-full ml-auto">
            {ALL_PRODUCTS.filter((_, i) => i % 7 === 0).length} items
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_PRODUCTS.filter((_, i) => i % 7 === 0).slice(0, 3).map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-tan/4 border border-amber-tan/10 rounded-lg">
              <div className="w-9 h-10 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                {PRODUCT_IMGS[p.id] && (
                  <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={40} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-dm text-xs text-linen-cream truncate">{p.name}</p>
                <p className="font-dm text-[10px] text-red-400 mt-0.5">3 units left</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
