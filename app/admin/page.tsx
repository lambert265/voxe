"use client";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";

const STATS = [
  { label: "Total Revenue",    value: "₦4,820,500", change: +18.4, icon: TrendingUp,  sub: "vs last month" },
  { label: "Total Orders",     value: "312",         change: +6.2,  icon: ShoppingBag, sub: "34 today"      },
  { label: "Total Customers",  value: "1,204",       change: +11.7, icon: Users,       sub: "18 new today"  },
  { label: "Active Products",  value: "48",          change: 0,     icon: Package,     sub: "3 low stock"   },
];

const ORDERS = [
  { id: "VXE-A1B2C3", customer: "Ada Okonkwo",    items: 2, total: 141500, status: "Delivered",  date: "12 Jun 2025", payment: "Card"     },
  { id: "VXE-D4E5F6", customer: "Emeka Nwosu",    items: 1, total: 89500,  status: "Processing", date: "12 Jun 2025", payment: "Transfer" },
  { id: "VXE-G7H8I9", customer: "Zara Bello",     items: 3, total: 178000, status: "Shipped",    date: "11 Jun 2025", payment: "Card"     },
  { id: "VXE-J1K2L3", customer: "Tunde Adeyemi",  items: 1, total: 47500,  status: "Pending",    date: "11 Jun 2025", payment: "POD"      },
  { id: "VXE-M4N5O6", customer: "Chisom Eze",     items: 4, total: 224000, status: "Delivered",  date: "10 Jun 2025", payment: "Card"     },
];

const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Pending:    "bg-linen-cream/8 text-linen-cream/50 border-linen-cream/12",
  Cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
};

const CHART_DATA = [38, 52, 41, 67, 48, 74, 61, 80, 55, 88, 70, 92, 65, 85, 72, 95, 60, 78, 83, 91, 68, 76, 89, 94, 71, 84, 77, 90, 63, 87];
const CHART_LABELS = ["1", "5", "10", "15", "20", "25", "30"];

const TOP_PRODUCTS = ALL_PRODUCTS.slice(0, 5);
const PRODUCT_IMGS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=80&q=70",
  2: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&q=70",
  3: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=70",
  9: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=80&q=70",
  15:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=70",
};

const LOW_STOCK = ALL_PRODUCTS.filter((_, i) => i % 7 === 0).slice(0, 3);

export default function AdminOverview() {
  const maxVal = Math.max(...CHART_DATA);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, sub }) => (
          <div key={label} className="card-gloss rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest">{label}</span>
              <div className="w-8 h-8 rounded-lg bg-amber-tan/10 border border-amber-tan/20 flex items-center justify-center">
                <Icon size={14} className="text-amber-tan" />
              </div>
            </div>
            <div>
              <p className="font-playfair text-3xl text-linen-cream leading-none">{value}</p>
              <div className="flex items-center justify-between mt-1.5">
                {change !== 0 ? (
                  <span className={`flex items-center gap-0.5 font-dm text-xs ${change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(change)}%
                  </span>
                ) : <span />}
                <span className="font-dm text-[10px] text-linen-cream/25">{sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Low Stock */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card-gloss rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-playfair text-xl text-linen-cream">Revenue</h3>
              <p className="font-dm text-xs text-linen-cream/30 mt-0.5">June 2025</p>
            </div>
            <div className="flex gap-2">
              {["Daily", "Weekly", "Monthly"].map((t, i) => (
                <button key={t} className={`font-dm text-[10px] px-3 py-1.5 rounded-full border transition-colors ${i === 0 ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/30 hover:border-amber-tan/40"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-1 h-36 mb-2">
            {CHART_DATA.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                <div className="relative w-full">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-dm text-[9px] text-amber-tan bg-obsidian border border-amber-tan/20 px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    ₦{(v * 15000).toLocaleString()}
                  </div>
                </div>
                <div
                  className="w-full rounded-sm transition-colors duration-150 bg-amber-tan/20 group-hover:bg-amber-tan/60"
                  style={{ height: `${(v / maxVal) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {CHART_LABELS.map((l) => (
              <span key={l} className="font-dm text-[9px] text-linen-cream/20">{l} Jun</span>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="card-gloss rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={14} className="text-amber-tan" />
            <h3 className="font-dm text-sm font-semibold text-linen-cream">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3 flex-1">
            {LOW_STOCK.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-tan/4 border border-amber-tan/10 rounded-lg">
                <div className="w-9 h-10 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                  {PRODUCT_IMGS[p.id] && <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={40} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-dm text-xs text-linen-cream truncate">{p.name}</p>
                  <p className="font-dm text-[10px] text-amber-tan mt-0.5">3 units left</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory" className="mt-4 font-dm text-[10px] text-amber-tan hover:underline text-center block">
            View Inventory →
          </Link>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 card-gloss rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-tan/10">
            <h3 className="font-playfair text-lg text-linen-cream">Recent Orders</h3>
            <Link href="/admin/orders" className="font-dm text-xs text-amber-tan hover:underline">View all</Link>
          </div>
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
                {ORDERS.map((o, i) => (
                  <tr key={o.id} className={`hover:bg-amber-tan/3 transition-colors ${i < ORDERS.length - 1 ? "border-b border-amber-tan/6" : ""}`}>
                    <td className="px-5 py-3.5 font-dm text-xs text-amber-tan font-semibold">{o.id}</td>
                    <td className="px-5 py-3.5 font-dm text-sm text-linen-cream">{o.customer}</td>
                    <td className="px-5 py-3.5 font-dm text-sm text-linen-cream font-medium">{formatNGN(o.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-dm text-[9px] tracking-wider uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/30">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="card-gloss rounded-xl p-5">
          <h3 className="font-playfair text-lg text-linen-cream mb-5">Top Products</h3>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="font-dm text-xs text-amber-tan/40 w-4 shrink-0">#{i + 1}</span>
                <div className="w-9 h-10 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                  {PRODUCT_IMGS[p.id] && <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={40} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-dm text-xs text-linen-cream truncate">{p.name}</p>
                  <p className="font-dm text-[10px] text-amber-tan">{formatNGN(p.price)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-dm text-xs text-linen-cream/40">{(5 - i) * 12} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
