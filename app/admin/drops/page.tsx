"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, X, Zap, Clock, ChevronDown, Trash2 } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/products";

const PRODUCT_IMGS: Record<number, string> = {
  1:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=80&q=70",3:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=70",
  6:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&q=70",9:"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=80&q=70",
  15:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=70",17:"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=80&q=70",
  24:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70",19:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=80&q=70",
};

type DropStatus = "Active" | "Scheduled" | "Ended";
type Drop = { id: number; name: string; startDate: string; endDate: string; products: number[]; status: DropStatus; limitedQty: number };

const INITIAL_DROPS: Drop[] = [
  { id: 1, name: "Drop 01 — The Obsidian Edit", startDate: "2025-06-01", endDate: "2025-06-15", products: [1, 6, 9, 13], status: "Ended",     limitedQty: 50  },
  { id: 2, name: "Drop 02 — SS25 Capsule",      startDate: "2025-06-20", endDate: "2025-07-05", products: [15, 17, 19, 24], status: "Active",    limitedQty: 30  },
  { id: 3, name: "Drop 03 — Street Series",     startDate: "2025-07-10", endDate: "2025-07-20", products: [3, 4, 5, 10],   status: "Scheduled", limitedQty: 40  },
];

const STATUS_STYLES: Record<DropStatus, string> = {
  Active:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Scheduled: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Ended:     "bg-linen-cream/8 text-linen-cream/35 border-linen-cream/12",
};

const EMPTY_FORM = { name: "", startDate: "", endDate: "", products: [] as number[], status: "Scheduled" as DropStatus, limitedQty: "30" };

export default function AdminDrops() {
  const [drops, setDrops] = useState(INITIAL_DROPS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [productSearch, setProductSearch] = useState("");

  const searchedProducts = ALL_PRODUCTS.filter((p) =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 12);

  function toggleProduct(id: number) {
    setForm((f) => ({
      ...f,
      products: f.products.includes(id) ? f.products.filter((x) => x !== id) : [...f.products, id],
    }));
  }

  function handleCreate() {
    if (!form.name || !form.startDate || !form.endDate) return;
    setDrops((prev) => [...prev, { ...form, id: Date.now(), limitedQty: Number(form.limitedQty) }]);
    setModal(false);
    setForm(EMPTY_FORM);
  }

  function deleteDrop(id: number) { setDrops((prev) => prev.filter((d) => d.id !== id)); }

  function toggleStatus(id: number) {
    setDrops((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const next: DropStatus = d.status === "Scheduled" ? "Active" : d.status === "Active" ? "Ended" : "Scheduled";
      return { ...d, status: next };
    }));
  }

  return (
    <div className="space-y-5">
      {/* Header action */}
      <div className="flex items-center justify-between">
        <p className="font-dm text-xs text-linen-cream/30">{drops.length} drops total</p>
        <button onClick={() => setModal(true)} className="btn-amber sheen flex items-center gap-2 px-5 py-2.5 text-obsidian font-dm font-semibold text-[11px] tracking-[0.15em] uppercase rounded-sm">
          <Plus size={14} /> Create Drop
        </button>
      </div>

      {/* Drops grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drops.map((drop) => {
          const dropProducts = ALL_PRODUCTS.filter((p) => drop.products.includes(p.id));
          return (
            <div key={drop.id} className="card-gloss rounded-xl overflow-hidden border border-amber-tan/10">
              {/* Product thumbnails strip */}
              <div className="flex h-24 overflow-hidden">
                {dropProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex-1 relative">
                    {PRODUCT_IMGS[p.id] ? (
                      <Image src={PRODUCT_IMGS[p.id]} alt={p.name} fill sizes="80px" className="object-cover object-center" />
                    ) : (
                      <div className="w-full h-full bg-charcoal" />
                    )}
                  </div>
                ))}
                {dropProducts.length === 0 && <div className="flex-1 bg-charcoal flex items-center justify-center"><Zap size={24} className="text-amber-tan/20" /></div>}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-playfair text-lg text-linen-cream leading-tight">{drop.name}</h3>
                  <span className={`font-dm text-[9px] tracking-wider uppercase px-2 py-1 rounded-full border shrink-0 ${STATUS_STYLES[drop.status]}`}>{drop.status}</span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 font-dm text-xs text-linen-cream/35">
                    <Clock size={11} className="text-amber-tan/50" />
                    {drop.startDate} → {drop.endDate}
                  </div>
                  <p className="font-dm text-xs text-linen-cream/35">{dropProducts.length} products · {drop.limitedQty} units each</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(drop.id)}
                    className="flex-1 py-2 border border-amber-tan/20 text-amber-tan font-dm text-[10px] tracking-widest uppercase hover:bg-amber-tan/8 transition-colors rounded-sm">
                    {drop.status === "Scheduled" ? "Activate" : drop.status === "Active" ? "End Drop" : "Reactivate"}
                  </button>
                  <button onClick={() => deleteDrop(drop.id)} className="w-9 h-9 border border-red-500/20 text-red-400/50 hover:text-red-400 hover:border-red-500/40 flex items-center justify-center transition-colors rounded-sm">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Drop Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="card-gloss rounded-2xl w-full max-w-xl border border-amber-tan/15">
            <div className="flex items-center justify-between px-6 py-5 border-b border-amber-tan/10">
              <h2 className="font-playfair text-xl text-linen-cream">Create Drop</h2>
              <button onClick={() => setModal(false)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-1.5">Drop Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder='e.g. "Drop 04 — The Night Edit"' className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
                <div>
                  <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-1.5">Limited Qty per Product</label>
                  <input type="number" value={form.limitedQty} onChange={(e) => setForm((f) => ({ ...f, limitedQty: e.target.value }))}
                    placeholder="30" className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
                <div>
                  <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-1.5">Status</label>
                  <div className="relative">
                    <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DropStatus }))}
                      className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm appearance-none pr-8">
                      {(["Scheduled","Active"] as DropStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-linen-cream/30 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Product selector */}
              <div>
                <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-2">
                  Select Products <span className="text-amber-tan">({form.products.length} selected)</span>
                </label>
                <div className="relative mb-2">
                  <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..." className="input-gold w-full px-4 py-2 rounded-sm font-dm text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                  {searchedProducts.map((p) => {
                    const selected = form.products.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => toggleProduct(p.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-colors ${selected ? "border-amber-tan bg-amber-tan/10" : "border-amber-tan/10 hover:border-amber-tan/30"}`}>
                        <div className="w-8 h-9 rounded-sm overflow-hidden bg-charcoal shrink-0">
                          {PRODUCT_IMGS[p.id] && <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={32} height={36} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-dm text-[10px] leading-snug truncate ${selected ? "text-amber-tan" : "text-linen-cream/60"}`}>{p.name}</p>
                          <p className="font-dm text-[9px] text-linen-cream/25 capitalize">{p.gender}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-amber-tan/10">
              <button onClick={() => setModal(false)} className="flex-1 py-3 border border-amber-tan/20 text-linen-cream/50 font-dm text-[11px] tracking-[0.15em] uppercase hover:border-amber-tan/40 transition-colors rounded-sm">Cancel</button>
              <button onClick={handleCreate} className="flex-1 btn-amber sheen py-3 text-obsidian font-dm font-semibold text-[11px] tracking-[0.15em] uppercase rounded-sm">Create Drop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
