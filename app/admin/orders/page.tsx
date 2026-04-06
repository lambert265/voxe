"use client";
import { useEffect, useState } from "react";
import { Search, X, MapPin, CreditCard, Package, RefreshCw } from "lucide-react";
import { formatNGN } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Pending:    "bg-linen-cream/8 text-linen-cream/40 border-linen-cream/12",
  Cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
};

type OrderItem = { id: number; name: string; price: number; size: string; color: string; quantity: number };
type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
};

export default function AdminOrders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [trackingNote, setTrackingNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  }

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q);
    }
    return true;
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  }

  function shortId(id: string) {
    return `VXE-${id.slice(0, 8).toUpperCase()}`;
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name or email..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-72" />
          </div>
          <button onClick={fetchOrders} className="text-linen-cream/30 hover:text-amber-tan transition-colors" title="Refresh">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...STATUS_FLOW].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`font-dm text-[10px] tracking-widest uppercase px-3.5 py-2 rounded-full border transition-colors ${statusFilter === s ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/35 hover:border-amber-tan/40 hover:text-linen-cream"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="font-dm text-xs text-linen-cream/30">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>

      {/* Table */}
      <div className="card-gloss rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-dm text-sm text-linen-cream/30">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-playfair text-2xl text-linen-cream/20 mb-2">No orders yet</p>
            <p className="font-dm text-sm text-linen-cream/20">Orders will appear here once customers checkout.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-tan/8">
                  {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left font-dm text-[9px] text-linen-cream/25 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr key={o.id}
                    className={`hover:bg-amber-tan/3 transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-amber-tan/6" : ""}`}
                    onClick={() => { setSelected(o); setTrackingNote(""); }}>
                    <td className="px-5 py-3.5 font-dm text-xs text-amber-tan font-semibold tracking-wider whitespace-nowrap">{shortId(o.id)}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-dm text-sm text-linen-cream">{o.customer_name}</p>
                      <p className="font-dm text-[10px] text-linen-cream/30">{o.customer_email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-dm text-sm text-linen-cream/50">{o.items?.length ?? 0}</td>
                    <td className="px-5 py-3.5 font-dm text-sm text-linen-cream font-medium whitespace-nowrap">{formatNGN(o.total)}</td>
                    <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/40 capitalize">{o.payment_method}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-dm text-[9px] tracking-wider uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[o.status] ?? STATUS_STYLES.Pending}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/30 whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-3.5 font-dm text-xs text-amber-tan hover:underline" onClick={(e) => { e.stopPropagation(); setSelected(o); }}>View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-[#0D0B06] border-l border-amber-tan/15 h-full overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-amber-tan/10 sticky top-0 bg-[#0D0B06] z-10">
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest">Order Detail</p>
                <h3 className="font-playfair text-xl text-linen-cream mt-0.5">{shortId(selected.id)}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* Customer */}
              <div className="card-gloss rounded-xl p-4 space-y-2">
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Customer</p>
                <p className="font-dm text-sm text-linen-cream font-medium">{selected.customer_name}</p>
                <p className="font-dm text-xs text-linen-cream/40">{selected.customer_email}</p>
                <p className="font-dm text-xs text-linen-cream/40">{selected.customer_phone}</p>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin size={12} className="text-amber-tan shrink-0 mt-0.5" />
                  <p className="font-dm text-xs text-linen-cream/40">{selected.delivery_address}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {(selected.items ?? []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-amber-tan/4 border border-amber-tan/10 rounded-lg">
                      <div>
                        <p className="font-dm text-sm text-linen-cream">{item.name}</p>
                        <p className="font-dm text-[10px] text-linen-cream/35 mt-0.5">{item.size} · {item.color} · ×{item.quantity}</p>
                      </div>
                      <p className="font-dm text-sm text-amber-tan font-medium">{formatNGN(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-amber-tan/10">
                  <span className="font-dm text-sm font-semibold text-linen-cream">Total</span>
                  <span className="font-playfair text-xl text-amber-tan">{formatNGN(selected.total)}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="card-gloss rounded-xl p-4">
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Payment</p>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-linen-cream/40" />
                  <span className="font-dm text-sm text-linen-cream capitalize">{selected.payment_method}</span>
                </div>
              </div>

              {/* Status update */}
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`font-dm text-[10px] tracking-widest uppercase px-3 py-2 rounded-full border transition-colors ${selected.status === s ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/35 hover:border-amber-tan/40"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking note */}
              <div>
                <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest block mb-1.5">Tracking Note</label>
                <div className="flex gap-2">
                  <input value={trackingNote} onChange={(e) => setTrackingNote(e.target.value)}
                    placeholder="e.g. Dispatched via DHL..." className="input-gold flex-1 px-3 py-2 rounded-sm font-dm text-sm" />
                  <button
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      await supabase.from("orders").update({ tracking_note: trackingNote }).eq("id", selected.id);
                      setSaving(false);
                    }}
                    className="btn-amber sheen px-4 py-2 text-obsidian font-dm font-semibold text-[10px] tracking-wider uppercase rounded-sm disabled:opacity-50">
                    {saving ? "…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
