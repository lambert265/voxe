"use client";
import { useState } from "react";
import { Search, X, ChevronDown, MapPin, CreditCard, Package } from "lucide-react";
import { formatNGN } from "@/lib/products";

const ALL_ORDERS = [
  { id:"VXE-A1B2C3", customer:"Ada Okonkwo",    email:"ada@example.com",    phone:"+234 801 234 5678", items:[{name:"Obsidian Trench Coat",qty:1,price:89500,size:"L",color:"Black"},{name:"Suede Chelsea Boots",qty:1,price:68000,size:"EU 42",color:"Tan"}],    total:157500, status:"Delivered",  payment:"Card",     address:"14 Adeola Odeku, Victoria Island, Lagos",     date:"12 Jun 2025", tracking:"VXE-TRK-001" },
  { id:"VXE-D4E5F6", customer:"Emeka Nwosu",    email:"emeka@example.com",  phone:"+234 802 345 6789", items:[{name:"Structured Blazer",qty:1,price:76000,size:"M",color:"Navy"}],                                                                                  total:76000,  status:"Processing", payment:"Transfer", address:"22 Wuse Zone 5, Abuja",                        date:"12 Jun 2025", tracking:""          },
  { id:"VXE-G7H8I9", customer:"Zara Bello",     email:"zara@example.com",   phone:"+234 803 456 7890", items:[{name:"Silk Wrap Dress",qty:1,price:61500,size:"S",color:"Cream"},{name:"Strappy Heeled Mules",qty:1,price:51500,size:"EU 37",color:"Tan"},{name:"Knit Cardigan",qty:1,price:34000,size:"XS",color:"Rust"}], total:147000, status:"Shipped",    payment:"Card",     address:"5 GRA Phase 2, Port Harcourt",                date:"11 Jun 2025", tracking:"VXE-TRK-002" },
  { id:"VXE-J1K2L3", customer:"Tunde Adeyemi",  email:"tunde@example.com",  phone:"+234 804 567 8901", items:[{name:"Heavyweight Hoodie",qty:1,price:47500,size:"XL",color:"Black"}],                                                                               total:47500,  status:"Pending",    payment:"POD",      address:"8 Ring Road, Ibadan",                          date:"11 Jun 2025", tracking:""          },
  { id:"VXE-M4N5O6", customer:"Chisom Eze",     email:"chisom@example.com", phone:"+234 805 678 9012", items:[{name:"Linen Co-ord Set",qty:2,price:55000,size:"M",color:"Cream"},{name:"Cream Leather Sneakers",qty:1,price:54000,size:"EU 38",color:"White"},{name:"Ribbed Crop Top",qty:1,price:15500,size:"S",color:"Black"}], total:179500, status:"Delivered",  payment:"Card",     address:"3 Awolowo Road, Ikoyi, Lagos",                date:"10 Jun 2025", tracking:"VXE-TRK-003" },
  { id:"VXE-P7Q8R9", customer:"Fatima Aliyu",   email:"fatima@example.com", phone:"+234 806 789 0123", items:[{name:"Wide-Leg Cargo Trousers",qty:1,price:41000,size:"L",color:"Olive"},{name:"Leather Sandals",qty:1,price:22000,size:"EU 41",color:"Tan"}],        total:63000,  status:"Cancelled",  payment:"Card",     address:"17 Maitama District, Abuja",                   date:"10 Jun 2025", tracking:""          },
  { id:"VXE-S1T2U3", customer:"Oluwaseun Babs", email:"seun@example.com",   phone:"+234 807 890 1234", items:[{name:"Suede Chelsea Boots",qty:1,price:68000,size:"EU 43",color:"Black"}],                                                                            total:68000,  status:"Shipped",    payment:"Transfer", address:"9 Bodija Estate, Ibadan",                      date:"09 Jun 2025", tracking:"VXE-TRK-004" },
  { id:"VXE-T2U3V4", customer:"Ngozi Obi",      email:"ngozi@example.com",  phone:"+234 808 901 2345", items:[{name:"Oversized Blazer",qty:1,price:72000,size:"M",color:"Black"},{name:"Pointed Toe Flats",qty:1,price:28000,size:"EU 39",color:"Black"}],           total:100000, status:"Processing", payment:"Card",     address:"11 Trans Amadi, Port Harcourt",                date:"09 Jun 2025", tracking:""          },
];

const STATUS_FLOW = ["Pending","Processing","Shipped","Delivered","Cancelled"];
const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Shipped:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Pending:    "bg-linen-cream/8 text-linen-cream/40 border-linen-cream/12",
  Cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
};

type Order = typeof ALL_ORDERS[0];

export default function AdminOrders() {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [trackingNote, setTrackingNote] = useState("");

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-72" />
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

      <p className="font-dm text-xs text-linen-cream/30">{filtered.length} orders</p>

      {/* Table */}
      <div className="card-gloss rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-tan/8">
                {["Order ID","Customer","Items","Total","Payment","Status","Date",""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-dm text-[9px] text-linen-cream/25 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} className={`hover:bg-amber-tan/3 transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-amber-tan/6" : ""}`}
                  onClick={() => setSelected(o)}>
                  <td className="px-5 py-3.5 font-dm text-xs text-amber-tan font-semibold tracking-wider">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-dm text-sm text-linen-cream">{o.customer}</p>
                    <p className="font-dm text-[10px] text-linen-cream/30">{o.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-dm text-sm text-linen-cream/50">{o.items.length}</td>
                  <td className="px-5 py-3.5 font-dm text-sm text-linen-cream font-medium">{formatNGN(o.total)}</td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/40">{o.payment}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-dm text-[9px] tracking-wider uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/30 whitespace-nowrap">{o.date}</td>
                  <td className="px-5 py-3.5 font-dm text-xs text-amber-tan hover:underline" onClick={(e) => { e.stopPropagation(); setSelected(o); }}>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-[#0D0B06] border-l border-amber-tan/15 h-full overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-amber-tan/10 sticky top-0 bg-[#0D0B06] z-10">
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest">Order Detail</p>
                <h3 className="font-playfair text-xl text-linen-cream mt-0.5">{selected.id}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* Customer */}
              <div className="card-gloss rounded-xl p-4 space-y-2">
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Customer</p>
                <p className="font-dm text-sm text-linen-cream font-medium">{selected.customer}</p>
                <p className="font-dm text-xs text-linen-cream/40">{selected.email}</p>
                <p className="font-dm text-xs text-linen-cream/40">{selected.phone}</p>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin size={12} className="text-amber-tan shrink-0 mt-0.5" />
                  <p className="font-dm text-xs text-linen-cream/40">{selected.address}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-amber-tan/4 border border-amber-tan/10 rounded-lg">
                      <div>
                        <p className="font-dm text-sm text-linen-cream">{item.name}</p>
                        <p className="font-dm text-[10px] text-linen-cream/35 mt-0.5">{item.size} · {item.color} · ×{item.qty}</p>
                      </div>
                      <p className="font-dm text-sm text-amber-tan font-medium">{formatNGN(item.price * item.qty)}</p>
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
                  <span className="font-dm text-sm text-linen-cream">{selected.payment}</span>
                  <span className="ml-auto font-dm text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Paid</span>
                </div>
              </div>

              {/* Status update */}
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {STATUS_FLOW.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`font-dm text-[10px] tracking-widest uppercase px-3 py-2 rounded-full border transition-colors ${selected.status === s ? "bg-amber-tan text-obsidian border-amber-tan font-semibold" : "border-amber-tan/15 text-linen-cream/35 hover:border-amber-tan/40"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {/* Tracking note */}
                <div>
                  <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest block mb-1.5">Tracking Note</label>
                  <div className="flex gap-2">
                    <input value={trackingNote} onChange={(e) => setTrackingNote(e.target.value)}
                      placeholder="e.g. Dispatched via DHL..." className="input-gold flex-1 px-3 py-2 rounded-sm font-dm text-sm" />
                    <button onClick={() => setTrackingNote("")} className="btn-amber sheen px-4 py-2 text-obsidian font-dm font-semibold text-[10px] tracking-wider uppercase rounded-sm">
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Tracking */}
              {selected.tracking && (
                <div className="card-gloss rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={13} className="text-amber-tan" />
                    <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest">Tracking</p>
                  </div>
                  <p className="font-dm text-sm text-linen-cream">{selected.tracking}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
