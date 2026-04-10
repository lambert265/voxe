"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Plus, Eye, Pencil, Trash2, X, ChevronDown, RefreshCw } from "lucide-react";
import {
  ALL_PRODUCTS, formatNGN, COLORS,
  CLOTHING_SIZES, TEEN_CLOTHING_SIZES, KIDS_CLOTHING_SIZES,
  SHOE_SIZES, TEEN_SHOE_SIZES, KIDS_SHOE_SIZES,
  type Gender, type ProductType,
} from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

const PRODUCT_IMGS: Record<number, string> = {
  1:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=80&q=70",
  2:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&q=70",
  3:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=70",
  4:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&q=70",
  5:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&q=70",
  6:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&q=70",
  7:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=80&q=70",
  8:"https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=80&q=70",
  9:"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=80&q=70",
  10:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=80&q=70",
  11:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=80&q=70",
  12:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=80&q=70",
  13:"https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=80&q=70",
  14:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=80&q=70",
  15:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&q=70",
  16:"https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=80&q=70",
  17:"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=80&q=70",
  18:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&q=70",
  19:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=80&q=70",
  20:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=80&q=70",
  21:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=80&q=70",
  22:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&q=70",
  23:"https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=80&q=70",
  24:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=70",
};

const SUBTYPES_BY_KEY: Record<string, string[]> = {
  "men-clothing":   ["T-Shirts","Shirts","Hoodies","Trousers","Jackets"],
  "men-footwear":   ["Sneakers","Boots","Loafers","Sandals","Formal"],
  "women-clothing": ["Tops","Dresses","Co-ords","Trousers","Blazers"],
  "women-footwear": ["Heels","Sneakers","Boots","Flats","Mules"],
  "teens-clothing": ["T-Shirts","Hoodies","Joggers","Dresses","Jackets"],
  "teens-footwear": ["Sneakers","Boots","Sandals","Slides"],
  "kids-clothing":  ["T-Shirts","Sets","Hoodies","Shorts","Dresses"],
  "kids-footwear":  ["Sneakers","Sandals","Boots","Slippers"],
};

function getSizes(gender: string, type: string) {
  if (type === "footwear") {
    if (gender === "kids") return KIDS_SHOE_SIZES;
    if (gender === "teens") return TEEN_SHOE_SIZES;
    return SHOE_SIZES;
  }
  if (gender === "kids") return KIDS_CLOTHING_SIZES;
  if (gender === "teens") return TEEN_CLOTHING_SIZES;
  return CLOTHING_SIZES;
}

type DBProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  gender: string;
  type: string;
  subtype: string;
  colors: string[];
  sizes: string[];
  tag: string | null;
  stock: number;
  sku: string;
  status: string;
  images: string[];
};

type FormState = {
  name: string; description: string; price: string;
  gender: Gender; type: ProductType; subtype: string;
  colors: string[]; sizes: string[]; tag: string; stock: string; sku: string; status: string;
};

const EMPTY_FORM: FormState = {
  name: "", description: "", price: "",
  gender: "men", type: "clothing", subtype: "",
  colors: [], sizes: [], tag: "", stock: "", sku: "", status: "Active",
};

function Label({ children }: { children: React.ReactNode }) {
  return <label className="font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-1.5">{children}</label>;
}

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm appearance-none pr-8">
        {children}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-linen-cream/30 pointer-events-none" />
    </div>
  );
}

export default function AdminProducts() {
  const supabase = createClient();
  // Use local products as base, overlay with any DB products
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [, setDbProducts] = useState<DBProduct[]>([]);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<Gender | "all">("all");
  const [filterType, setFilterType] = useState<ProductType | "all">("all");
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<typeof ALL_PRODUCTS[0] | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch any products added via admin from Supabase
  async function fetchDbProducts() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setDbProducts((data as DBProduct[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchDbProducts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = products.filter((p) => {
    if (filterGender !== "all" && p.gender !== filterGender) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function openAdd() { setForm(EMPTY_FORM); setModal("add"); }
  function openEdit(p: typeof ALL_PRODUCTS[0]) {
    setSelected(p);
    setForm({
      name: p.name, description: "", price: String(p.price),
      gender: p.gender, type: p.type, subtype: p.subtype,
      colors: p.colors, sizes: p.sizes, tag: p.tag ?? "", stock: "24",
      sku: `VXE-${p.id.toString().padStart(4,"0")}`, status: "Active",
    });
    setModal("edit");
  }
  function openView(p: typeof ALL_PRODUCTS[0]) { setSelected(p); setModal("view"); }
  function setF(k: keyof FormState, v: string | string[]) { setForm((f) => ({ ...f, [k]: v })); }
  function toggleArr(arr: string[], val: string) {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  async function handleSave() {
    setSaving(true);
    if (modal === "add") {
      await supabase.from("products").insert({
        name: form.name, description: form.description,
        price: Number(form.price), gender: form.gender, type: form.type,
        subtype: form.subtype, colors: form.colors, sizes: form.sizes,
        tag: form.tag || null, stock: Number(form.stock), sku: form.sku, status: form.status,
      });
      await fetchDbProducts();
    } else if (modal === "edit" && selected) {
      // Update in Supabase if it exists there, otherwise just update local state
      await supabase.from("products").update({
        name: form.name, price: Number(form.price),
        colors: form.colors, sizes: form.sizes, tag: form.tag || null, status: form.status,
      }).eq("sku", form.sku);
      setProducts((prev) => prev.map((p) =>
        p.id === selected.id ? { ...p, name: form.name, price: Number(form.price), colors: form.colors, sizes: form.sizes, tag: form.tag || undefined } : p
      ));
    }
    setSaving(false);
    setModal(null);
  }

  async function handleDelete(id: number) {
    const sku = `VXE-${id.toString().padStart(4,"0")}`;
    await supabase.from("products").delete().eq("sku", sku);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  }

  const subtypes = SUBTYPES_BY_KEY[`${form.gender}-${form.type}`] ?? [];
  const availableSizes = getSizes(form.gender, form.type);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-52" />
          </div>
          <div className="relative">
            <select value={filterGender} onChange={(e) => setFilterGender(e.target.value as Gender | "all")}
              className="input-gold px-3 py-2 rounded-lg font-dm text-sm appearance-none pr-7 capitalize">
              {(["all","men","women","teens","kids"] as const).map((g) => <option key={g} value={g}>{g === "all" ? "All Genders" : g}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-linen-cream/25 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as ProductType | "all")}
              className="input-gold px-3 py-2 rounded-lg font-dm text-sm appearance-none pr-7 capitalize">
              {(["all","clothing","footwear"] as const).map((t) => <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-linen-cream/25 pointer-events-none" />
          </div>
          <button onClick={fetchDbProducts} className="text-linen-cream/30 hover:text-amber-tan transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <button onClick={openAdd} className="btn-amber sheen flex items-center gap-2 px-5 py-2.5 text-obsidian font-dm font-semibold text-[11px] tracking-[0.15em] uppercase rounded-sm shrink-0">
          <Plus size={14} /> Add Product
        </button>
      </div>

      <p className="font-dm text-xs text-linen-cream/40">{filtered.length} products</p>

      <div className="card-gloss rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-tan/8">
                {["Product","Gender","Type","Price","Tag","Status",""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-dm text-[9px] text-linen-cream/30 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`hover:bg-amber-tan/3 transition-colors ${i < filtered.length - 1 ? "border-b border-amber-tan/6" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-11 rounded-sm overflow-hidden bg-charcoal shrink-0 border border-amber-tan/10">
                        {PRODUCT_IMGS[p.id] && <Image src={PRODUCT_IMGS[p.id]} alt={p.name} width={36} height={44} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-dm text-sm text-linen-cream leading-snug">{p.name}</p>
                        <p className="font-dm text-[10px] text-linen-cream/30 mt-0.5">VXE-{p.id.toString().padStart(4,"0")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/60 capitalize">{p.gender}</td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/60 capitalize">{p.type} · {p.subtype}</td>
                  <td className="px-5 py-3.5 font-dm text-sm text-amber-tan font-medium">{formatNGN(p.price)}</td>
                  <td className="px-5 py-3.5">
                    {p.tag
                      ? <span className="font-dm text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full border bg-amber-tan/10 text-amber-tan border-amber-tan/20">{p.tag}</span>
                      : <span className="text-linen-cream/15 font-dm text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-dm text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openView(p)} className="text-linen-cream/25 hover:text-amber-tan transition-colors"><Eye size={14} /></button>
                      <button onClick={() => openEdit(p)} className="text-linen-cream/25 hover:text-amber-tan transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="text-linen-cream/25 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="card-gloss rounded-2xl w-full max-w-2xl border border-amber-tan/15">
            <div className="flex items-center justify-between px-6 py-5 border-b border-amber-tan/10">
              <h2 className="font-dm text-xl text-linen-cream">{modal === "add" ? "Add Product" : "Edit Product"}</h2>
              <button onClick={() => setModal(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>Product Name</Label>
                  <input value={form.name} onChange={(e) => setF("name", e.target.value)}
                    placeholder="e.g. Obsidian Trench Coat" className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Description</Label>
                  <textarea value={form.description} onChange={(e) => setF("description", e.target.value)}
                    rows={2} className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm resize-none" />
                </div>
                <div>
                  <Label>Price (₦)</Label>
                  <input type="number" value={form.price} onChange={(e) => setF("price", e.target.value)}
                    placeholder="89500" className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <input type="number" value={form.stock} onChange={(e) => setF("stock", e.target.value)}
                    placeholder="24" className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Sel value={form.gender} onChange={(v) => { setF("gender", v); setF("subtype", ""); setF("sizes", []); }}>
                    {(["men","women","teens","kids"] as Gender[]).map((g) => <option key={g} value={g} className="capitalize">{g}</option>)}
                  </Sel>
                </div>
                <div>
                  <Label>Type</Label>
                  <Sel value={form.type} onChange={(v) => { setF("type", v); setF("subtype", ""); setF("sizes", []); }}>
                    {(["clothing","footwear"] as ProductType[]).map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </Sel>
                </div>
                <div>
                  <Label>Subtype</Label>
                  <Sel value={form.subtype} onChange={(v) => setF("subtype", v)}>
                    <option value="">Select subtype</option>
                    {subtypes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Sel>
                </div>
                <div>
                  <Label>Tag</Label>
                  <Sel value={form.tag} onChange={(v) => setF("tag", v)}>
                    <option value="">No tag</option>
                    {["New","Bestseller","Limited"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </Sel>
                </div>
                <div>
                  <Label>SKU</Label>
                  <input value={form.sku} onChange={(e) => setF("sku", e.target.value)}
                    placeholder="VXE-0001" className="input-gold w-full px-4 py-2.5 rounded-sm font-dm text-sm" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Sel value={form.status} onChange={(v) => setF("status", v)}>
                    {["Active","Draft"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </Sel>
                </div>
              </div>

              <div>
                <Label>Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c.name} type="button" onClick={() => setF("colors", toggleArr(form.colors, c.name))}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-dm text-xs transition-colors ${form.colors.includes(c.name) ? "border-amber-tan text-amber-tan bg-amber-tan/10" : "border-amber-tan/15 text-linen-cream/50 hover:border-amber-tan/40"}`}>
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((s) => (
                    <button key={s} type="button" onClick={() => setF("sizes", toggleArr(form.sizes, s))}
                      className={`px-3 py-1.5 border font-dm text-xs rounded-sm transition-colors ${form.sizes.includes(s) ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/50 hover:border-amber-tan/40"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-amber-tan/10">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-amber-tan/20 text-linen-cream/50 font-dm text-[11px] tracking-[0.15em] uppercase hover:border-amber-tan/40 transition-colors rounded-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-amber sheen py-3 text-obsidian font-dm font-semibold text-[11px] tracking-[0.15em] uppercase rounded-sm disabled:opacity-50">
                {saving ? "Saving…" : modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === "view" && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="card-gloss rounded-2xl w-full max-w-md border border-amber-tan/15 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-dm text-xl text-linen-cream">{selected.name}</h2>
              <button onClick={() => setModal(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-3 font-dm text-sm">
              {[
                ["SKU", `VXE-${selected.id.toString().padStart(4,"0")}`],
                ["Gender", selected.gender],
                ["Type", `${selected.type} · ${selected.subtype}`],
                ["Price", formatNGN(selected.price)],
                ["Colors", selected.colors.join(", ")],
                ["Sizes", selected.sizes.join(", ")],
                ["Tag", selected.tag ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-amber-tan/6">
                  <span className="text-linen-cream/40">{k}</span>
                  <span className="text-linen-cream capitalize">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => openEdit(selected)} className="mt-5 w-full btn-amber sheen py-3 text-obsidian font-dm font-semibold text-[11px] tracking-[0.15em] uppercase rounded-sm">
              Edit Product
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="card-gloss rounded-2xl w-full max-w-sm border border-red-500/20 p-6 text-center">
            <Trash2 size={28} className="text-red-400 mx-auto mb-4" />
            <h3 className="font-dm text-xl text-linen-cream mb-2">Delete Product?</h3>
            <p className="font-dm text-sm text-linen-cream/40 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-amber-tan/20 text-linen-cream/50 font-dm text-xs uppercase tracking-widest hover:border-amber-tan/40 transition-colors rounded-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-500/80 hover:bg-red-500 text-white font-dm text-xs uppercase tracking-widest transition-colors rounded-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
