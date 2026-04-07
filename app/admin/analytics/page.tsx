"use client";
import { useState } from "react";
import Image from "next/image";
import { TrendingUp, ShoppingBag, Users, ArrowUpRight } from "lucide-react";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";

const PRODUCT_IMGS: Record<number, string> = {
  1:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=80&q=70",
  9:"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=80&q=70",
  15:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=70",
  24:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70",
  3:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=70",
};

const REVENUE_DATA = [42,58,47,71,53,88,65,79,61,94,72,85,68,91,76,83,57,96,74,88,63,79,92,85,70,87,78,95,66,90];
const ORDERS_DATA  = [12,18,14,22,16,28,20,25,18,30,23,27,21,29,24,26,17,31,23,28,19,25,30,27,22,28,25,32,20,29];

const TOP_PRODUCTS = ALL_PRODUCTS.slice(0, 5).map((p, i) => ({ ...p, sold: [60, 48, 41, 37, 29][i], revenue: p.price * [60, 48, 41, 37, 29][i] }));

const GENDER_BREAKDOWN = [
  { label: "Men",   pct: 38, color: "bg-amber-tan"    },
  { label: "Women", pct: 34, color: "bg-amber-light"  },
  { label: "Teens", pct: 18, color: "bg-amber-dark"   },
  { label: "Kids",  pct: 10, color: "bg-linen-cream/40" },
];

const TYPE_BREAKDOWN = [
  { label: "Clothing", pct: 62, color: "bg-amber-tan"   },
  { label: "Footwear", pct: 38, color: "bg-amber-dark"  },
];

type Period = "7d" | "30d" | "90d";

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>("30d");

  const revenueMax = Math.max(...REVENUE_DATA);
  const ordersMax  = Math.max(...ORDERS_DATA);
  const totalRevenue = REVENUE_DATA.reduce((s, v) => s + v * 15000, 0);
  const totalOrders  = ORDERS_DATA.reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {(["7d","30d","90d"] as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`font-dm text-[10px] tracking-widest uppercase px-4 py-2 rounded-full border transition-colors ${period === p ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/35 hover:border-amber-tan/40"}`}>
            {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue",  value: formatNGN(totalRevenue), change: 18.4, icon: TrendingUp  },
          { label: "Total Orders",   value: String(totalOrders),     change: 6.2,  icon: ShoppingBag },
          { label: "New Customers",  value: "204",                   change: 11.7, icon: Users       },
        ].map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="card-gloss rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-tan/10 border border-amber-tan/20 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-amber-tan" />
            </div>
            <div>
              <p className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest">{label}</p>
              <p className="font-dm text-2xl text-linen-cream mt-0.5">{value}</p>
              <span className="flex items-center gap-0.5 font-dm text-xs text-emerald-400 mt-0.5">
                <ArrowUpRight size={11} />{change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card-gloss rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-dm text-xl text-linen-cream">Revenue Over Time</h3>
          <span className="font-dm text-xs text-linen-cream/25">{period === "7d" ? "Last 7 days" : period === "30d" ? "June 2025" : "Last 90 days"}</span>
        </div>
        <div className="flex items-end gap-1 h-40 mb-2">
          {REVENUE_DATA.map((v, i) => (
            <div key={i} className="flex-1 group cursor-pointer relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-dm text-[9px] text-amber-tan bg-obsidian border border-amber-tan/20 px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {formatNGN(v * 15000)}
              </div>
              <div className="w-full rounded-sm bg-amber-tan/20 group-hover:bg-amber-tan/60 transition-colors" style={{ height: `${(v / revenueMax) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {["1","5","10","15","20","25","30"].map((l) => (
            <span key={l} className="font-dm text-[9px] text-linen-cream/20">{l}</span>
          ))}
        </div>
      </div>

      {/* Orders chart */}
      <div className="card-gloss rounded-xl p-6">
        <h3 className="font-dm text-xl text-linen-cream mb-6">Orders Over Time</h3>
        <div className="flex items-end gap-1 h-28 mb-2">
          {ORDERS_DATA.map((v, i) => (
            <div key={i} className="flex-1 group cursor-pointer relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-dm text-[9px] text-amber-tan bg-obsidian border border-amber-tan/20 px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {v} orders
              </div>
              <div className="w-full rounded-sm bg-blue-500/20 group-hover:bg-blue-500/50 transition-colors" style={{ height: `${(v / ordersMax) * 100}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Top products + breakdowns */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="card-gloss rounded-xl p-5">
          <h3 className="font-dm text-lg text-linen-cream mb-5">Top Products</h3>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="font-dm text-xs text-amber-tan/40 w-4 shrink-0">#{i+1}</span>
                <div className="w-9 h-10 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                  {PRODUCT_IMGS[p.id] && <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={40} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-dm text-xs text-linen-cream truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-amber-tan/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-tan rounded-full" style={{ width: `${(p.sold / 60) * 100}%` }} />
                    </div>
                    <span className="font-dm text-[10px] text-linen-cream/30 shrink-0">{p.sold} sold</span>
                  </div>
                </div>
                <p className="font-dm text-xs text-amber-tan shrink-0">{formatNGN(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdowns */}
        <div className="space-y-4">
          <div className="card-gloss rounded-xl p-5">
            <h3 className="font-dm text-lg text-linen-cream mb-4">Sales by Gender</h3>
            <div className="space-y-3">
              {GENDER_BREAKDOWN.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between font-dm text-xs mb-1.5">
                    <span className="text-linen-cream/50 capitalize">{label}</span>
                    <span className="text-linen-cream">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-amber-tan/8 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-gloss rounded-xl p-5">
            <h3 className="font-dm text-lg text-linen-cream mb-4">Clothing vs Footwear</h3>
            <div className="space-y-3">
              {TYPE_BREAKDOWN.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between font-dm text-xs mb-1.5">
                    <span className="text-linen-cream/50">{label}</span>
                    <span className="text-linen-cream">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-amber-tan/8 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
