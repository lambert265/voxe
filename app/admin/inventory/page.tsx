"use client";
import { useState } from "react";
import Image from "next/image";
import { Search, AlertTriangle, ChevronDown, Minus, Plus } from "lucide-react";
import { ALL_PRODUCTS, formatNGN, type Gender } from "@/lib/products";

const PRODUCT_IMGS: Record<number, string> = {
  1:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=80&q=70",2:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&q=70",
  3:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=70",4:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&q=70",
  5:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&q=70",6:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&q=70",
  9:"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=80&q=70",15:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=70",
  24:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70",19:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=80&q=70",
};

// Assign mock stock levels
const INITIAL_STOCK: Record<number, number> = Object.fromEntries(
  ALL_PRODUCTS.map((p, i) => [p.id, [24, 18, 3, 45, 2, 31, 8, 56, 4, 22, 15, 38, 1, 29, 12, 44, 7, 33, 5, 27, 19, 41, 6, 35, 16, 48, 9, 23, 14, 37, 11, 26, 43, 20, 32, 47, 3, 28, 15, 39, 8, 21, 34, 46, 17, 30, 42, 25][i] ?? 20])
);

function stockStatus(qty: number): { label: string; cls: string } {
  if (qty === 0) return { label: "Out of Stock", cls: "bg-red-500/15 text-red-400 border-red-500/20" };
  if (qty <= 5)  return { label: "Low Stock",    cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
  return              { label: "In Stock",       cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
}

export default function AdminInventory() {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterGender, setFilterGender] = useState<Gender | "all">("all");

  function adjust(id: number, delta: number) {
    setStock((s) => ({ ...s, [id]: Math.max(0, (s[id] ?? 0) + delta) }));
  }

  const filtered = ALL_PRODUCTS.filter((p) => {
    const qty = stock[p.id] ?? 0;
    const status = stockStatus(qty).label;
    if (filterStatus !== "All" && status !== filterStatus) return false;
    if (filterGender !== "all" && p.gender !== filterGender) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowCount = ALL_PRODUCTS.filter((p) => (stock[p.id] ?? 0) <= 5 && (stock[p.id] ?? 0) > 0).length;
  const outCount = ALL_PRODUCTS.filter((p) => (stock[p.id] ?? 0) === 0).length;

  return (
    <div className="space-y-5">
      {/* Alert banner */}
      {(lowCount > 0 || outCount > 0) && (
        <div className="flex items-center gap-3 p-4 bg-amber-tan/8 border border-amber-tan/20 rounded-xl">
          <AlertTriangle size={16} className="text-amber-tan shrink-0" />
          <p className="font-dm text-sm text-linen-cream">
            <span className="text-amber-tan font-semibold">{lowCount} products</span> are low on stock
            {outCount > 0 && <>, <span className="text-red-400 font-semibold">{outCount} products</span> are out of stock</>}.
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-52" />
        </div>
        {["All","In Stock","Low Stock","Out of Stock"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`font-dm text-[10px] tracking-widest uppercase px-3.5 py-2 rounded-full border transition-colors ${filterStatus === s ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/35 hover:border-amber-tan/40"}`}>
            {s}
          </button>
        ))}
        <div className="relative ml-auto">
          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value as Gender | "all")}
            className="input-gold px-3 py-2 rounded-lg font-dm text-sm appearance-none pr-7 capitalize">
            {(["all","men","women","teens","kids"] as (Gender|"all")[]).map((g) => (
              <option key={g} value={g}>{g === "all" ? "All Genders" : g}</option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-linen-cream/25 pointer-events-none" />
        </div>
      </div>

      <p className="font-dm text-xs text-linen-cream/30">{filtered.length} products</p>

      {/* Table */}
      <div className="card-gloss rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-tan/8">
                {["Product","Gender / Type","Price","Stock Qty","Status","Adjust"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-dm text-[9px] text-linen-cream/25 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const qty = stock[p.id] ?? 0;
                const { label, cls } = stockStatus(qty);
                return (
                  <tr key={p.id} className={`hover:bg-amber-tan/3 transition-colors ${i < filtered.length - 1 ? "border-b border-amber-tan/6" : ""}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-11 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                          {PRODUCT_IMGS[p.id] && <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={44} className="w-full h-full object-cover" />}
                        </div>
                        <p className="font-dm text-sm text-linen-cream leading-snug">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/40 capitalize">{p.gender} · {p.type}</td>
                    <td className="px-5 py-3.5 font-dm text-sm text-amber-tan">{formatNGN(p.price)}</td>
                    <td className="px-5 py-3.5 font-dm text-xl text-linen-cream">{qty}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-dm text-[9px] tracking-wider uppercase px-2 py-1 rounded-full border ${cls}`}>{label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => adjust(p.id, -1)} className="w-7 h-7 rounded-sm border border-amber-tan/20 flex items-center justify-center text-linen-cream/40 hover:border-amber-tan hover:text-amber-tan transition-colors">
                          <Minus size={11} />
                        </button>
                        <button onClick={() => adjust(p.id, +1)} className="w-7 h-7 rounded-sm border border-amber-tan/20 flex items-center justify-center text-linen-cream/40 hover:border-amber-tan hover:text-amber-tan transition-colors">
                          <Plus size={11} />
                        </button>
                        <button onClick={() => adjust(p.id, +10)} className="ml-1 font-dm text-[10px] text-amber-tan/50 hover:text-amber-tan transition-colors px-2 py-1 border border-amber-tan/10 rounded-sm">
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
