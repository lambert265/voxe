"use client";
import { useState, useEffect } from "react";
import { Search, X, MapPin, RefreshCw } from "lucide-react";
import { formatNGN } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
};

function initials(name: string) {
  return (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminCustomers() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  async function fetchCustomers() {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, city, created_at")
      .order("created_at", { ascending: false });

    if (!profiles) { setLoading(false); return; }

    // Fetch order stats per customer
    const enriched = await Promise.all(profiles.map(async (p) => {
      const { data: orders } = await supabase
        .from("orders")
        .select("total")
        .eq("user_id", p.id);
      return {
        ...p,
        order_count: orders?.length ?? 0,
        total_spent: orders?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0,
      };
    }));

    setCustomers(enriched);
    setLoading(false);
  }

  useEffect(() => { fetchCustomers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = customers.filter((c) =>
    !search ||
    (c.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-64" />
        </div>
        <span className="font-dm text-xs text-linen-cream/40">{filtered.length} customers</span>
        <button onClick={fetchCustomers} className="text-linen-cream/30 hover:text-amber-tan transition-colors ml-auto">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="card-gloss rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-dm text-sm text-linen-cream/30">Loading customers…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-dm text-sm text-linen-cream/20">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-tan/8">
                  {["Customer", "Location", "Orders", "Total Spent", "Joined", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left font-dm text-[9px] text-linen-cream/25 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id}
                    className={`hover:bg-amber-tan/3 transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-amber-tan/6" : ""}`}
                    onClick={() => setSelected(c)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-tan/15 border border-amber-tan/25 flex items-center justify-center shrink-0">
                          <span className="font-dm text-[10px] font-bold text-amber-tan">{initials(c.full_name)}</span>
                        </div>
                        <div>
                          <p className="font-dm text-sm text-linen-cream">{c.full_name || "—"}</p>
                          <p className="font-dm text-[10px] text-linen-cream/35">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/50">{c.city || "—"}</td>
                    <td className="px-5 py-3.5 font-dm text-sm text-linen-cream">{c.order_count}</td>
                    <td className="px-5 py-3.5 font-dm text-sm text-amber-tan font-medium">{formatNGN(c.total_spent ?? 0)}</td>
                    <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/35">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3.5 font-dm text-xs text-amber-tan hover:underline">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm bg-[#0D0B06] border-l border-amber-tan/15 h-full overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-amber-tan/10 sticky top-0 bg-[#0D0B06] z-10">
              <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest">Customer Profile</p>
              <button onClick={() => setSelected(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-amber-tan/15 border-2 border-amber-tan/30 flex items-center justify-center">
                  <span className="font-dm text-2xl text-amber-tan">{initials(selected.full_name)}</span>
                </div>
                <div>
                  <h3 className="font-dm text-xl text-linen-cream">{selected.full_name || "—"}</h3>
                  <p className="font-dm text-xs text-linen-cream/35 mt-0.5">Joined {formatDate(selected.created_at)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="card-gloss rounded-xl p-4 text-center">
                  <p className="font-dm text-2xl text-amber-tan">{selected.order_count}</p>
                  <p className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest mt-1">Orders</p>
                </div>
                <div className="card-gloss rounded-xl p-4 text-center">
                  <p className="font-dm text-lg text-amber-tan">{formatNGN(selected.total_spent ?? 0)}</p>
                  <p className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest mt-1">Total Spent</p>
                </div>
              </div>

              <div className="card-gloss rounded-xl p-4 space-y-2.5">
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Contact</p>
                {[["Email", selected.email], ["Phone", selected.phone || "—"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-dm text-xs text-linen-cream/35">{k}</span>
                    <span className="font-dm text-xs text-linen-cream">{v}</span>
                  </div>
                ))}
                {selected.city && (
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin size={11} className="text-amber-tan shrink-0 mt-0.5" />
                    <span className="font-dm text-xs text-linen-cream/40">{selected.city}, Nigeria</span>
                  </div>
                )}
              </div>

              {(selected.order_count ?? 0) > 0 && (
                <div className="card-gloss rounded-xl p-4">
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Stats</p>
                  <div className="flex justify-between">
                    <span className="font-dm text-xs text-linen-cream/35">Avg. Order Value</span>
                    <span className="font-dm text-xs text-linen-cream">
                      {formatNGN(Math.round((selected.total_spent ?? 0) / (selected.order_count ?? 1)))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
