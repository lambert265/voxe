"use client";
import { useState } from "react";
import { Search, X, ShoppingBag, MapPin } from "lucide-react";
import { formatNGN } from "@/lib/products";

const CUSTOMERS = [
  { id:1, name:"Ada Okonkwo",    email:"ada@example.com",    phone:"+234 801 234 5678", orders:7,  spent:641500, location:"Lagos",       joined:"Jan 2025", lastOrder:"12 Jun 2025" },
  { id:2, name:"Emeka Nwosu",    email:"emeka@example.com",  phone:"+234 802 345 6789", orders:3,  spent:224000, location:"Abuja",       joined:"Feb 2025", lastOrder:"12 Jun 2025" },
  { id:3, name:"Zara Bello",     email:"zara@example.com",   phone:"+234 803 456 7890", orders:12, spent:987000, location:"Port Harcourt",joined:"Nov 2024", lastOrder:"11 Jun 2025" },
  { id:4, name:"Tunde Adeyemi",  email:"tunde@example.com",  phone:"+234 804 567 8901", orders:2,  spent:95000,  location:"Ibadan",      joined:"Mar 2025", lastOrder:"11 Jun 2025" },
  { id:5, name:"Chisom Eze",     email:"chisom@example.com", phone:"+234 805 678 9012", orders:9,  spent:812000, location:"Lagos",       joined:"Dec 2024", lastOrder:"10 Jun 2025" },
  { id:6, name:"Fatima Aliyu",   email:"fatima@example.com", phone:"+234 806 789 0123", orders:4,  spent:315000, location:"Abuja",       joined:"Feb 2025", lastOrder:"10 Jun 2025" },
  { id:7, name:"Oluwaseun Babs", email:"seun@example.com",   phone:"+234 807 890 1234", orders:6,  spent:478000, location:"Ibadan",      joined:"Jan 2025", lastOrder:"09 Jun 2025" },
  { id:8, name:"Ngozi Obi",      email:"ngozi@example.com",  phone:"+234 808 901 2345", orders:5,  spent:390000, location:"Port Harcourt",joined:"Mar 2025", lastOrder:"09 Jun 2025" },
  { id:9, name:"Kemi Adebayo",   email:"kemi@example.com",   phone:"+234 809 012 3456", orders:15, spent:1240000,location:"Lagos",       joined:"Oct 2024", lastOrder:"08 Jun 2025" },
  { id:10,name:"Uche Okafor",    email:"uche@example.com",   phone:"+234 810 123 4567", orders:1,  spent:47500,  location:"Enugu",       joined:"Jun 2025", lastOrder:"07 Jun 2025" },
];

type Customer = typeof CUSTOMERS[0];

function initials(name: string) { return name.split(" ").map((n) => n[0]).join("").toUpperCase(); }

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = CUSTOMERS.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-64" />
        </div>
        <span className="font-dm text-xs text-linen-cream/30">{filtered.length} customers</span>
      </div>

      {/* Table */}
      <div className="card-gloss rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-tan/8">
                {["Customer","Location","Orders","Total Spent","Joined","Last Order",""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-dm text-[9px] text-linen-cream/25 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`hover:bg-amber-tan/3 transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-amber-tan/6" : ""}`}
                  onClick={() => setSelected(c)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-tan/15 border border-amber-tan/25 flex items-center justify-center shrink-0">
                        <span className="font-dm text-[10px] font-bold text-amber-tan">{initials(c.name)}</span>
                      </div>
                      <div>
                        <p className="font-dm text-sm text-linen-cream">{c.name}</p>
                        <p className="font-dm text-[10px] text-linen-cream/30">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/40">{c.location}</td>
                  <td className="px-5 py-3.5 font-dm text-sm text-linen-cream">{c.orders}</td>
                  <td className="px-5 py-3.5 font-dm text-sm text-amber-tan font-medium">{formatNGN(c.spent)}</td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/30">{c.joined}</td>
                  <td className="px-5 py-3.5 font-dm text-xs text-linen-cream/30">{c.lastOrder}</td>
                  <td className="px-5 py-3.5 font-dm text-xs text-amber-tan hover:underline">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer profile drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm bg-[#0D0B06] border-l border-amber-tan/15 h-full overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-amber-tan/10 sticky top-0 bg-[#0D0B06] z-10">
              <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest">Customer Profile</p>
              <button onClick={() => setSelected(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar + name */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-amber-tan/15 border-2 border-amber-tan/30 flex items-center justify-center">
                  <span className="font-playfair text-2xl text-amber-tan">{initials(selected.name)}</span>
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-linen-cream">{selected.name}</h3>
                  <p className="font-dm text-xs text-linen-cream/35 mt-0.5">Customer since {selected.joined}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card-gloss rounded-xl p-4 text-center">
                  <p className="font-playfair text-2xl text-amber-tan">{selected.orders}</p>
                  <p className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest mt-1">Orders</p>
                </div>
                <div className="card-gloss rounded-xl p-4 text-center">
                  <p className="font-playfair text-lg text-amber-tan">{formatNGN(selected.spent)}</p>
                  <p className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-widest mt-1">Total Spent</p>
                </div>
              </div>

              {/* Contact */}
              <div className="card-gloss rounded-xl p-4 space-y-2.5">
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Contact</p>
                {[["Email", selected.email], ["Phone", selected.phone]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-dm text-xs text-linen-cream/35">{k}</span>
                    <span className="font-dm text-xs text-linen-cream">{v}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2 pt-1">
                  <MapPin size={11} className="text-amber-tan shrink-0 mt-0.5" />
                  <span className="font-dm text-xs text-linen-cream/40">{selected.location}, Nigeria</span>
                </div>
              </div>

              {/* Activity */}
              <div>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Activity</p>
                <div className="space-y-2">
                  {[
                    { label: "Last Order", value: selected.lastOrder },
                    { label: "Avg. Order Value", value: formatNGN(Math.round(selected.spent / selected.orders)) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-amber-tan/6 pb-2">
                      <span className="font-dm text-xs text-linen-cream/35">{label}</span>
                      <span className="font-dm text-xs text-linen-cream">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
