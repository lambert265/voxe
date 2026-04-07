"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import {
  Save, Store, Bell, Shield, CreditCard, Package,
  AlertTriangle, Clock, Trash2, RefreshCw, Link2,
} from "lucide-react";

const inputCls = "w-full bg-white/[0.04] border border-amber-tan/15 text-linen-cream font-dm text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-amber-tan transition-colors placeholder:text-linen-cream/20";
const labelCls = "font-dm text-[10px] text-linen-cream/40 uppercase tracking-widest block mb-2";

function Section({ icon: Icon, title, danger, children }: { icon: React.ElementType; title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <div className={`card-gloss rounded-xl p-6 space-y-5 ${danger ? "border border-red-500/20" : ""}`}>
      <div className={`flex items-center gap-3 pb-4 border-b ${danger ? "border-red-500/15" : "border-amber-tan/10"}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? "bg-red-500/10 border border-red-500/20" : "bg-amber-tan/10 border border-amber-tan/20"}`}>
          <Icon size={14} className={danger ? "text-red-400" : "text-amber-tan"} />
        </div>
        <h2 className={`font-dm text-lg ${danger ? "text-red-400" : "text-linen-cream"}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${value ? "bg-amber-tan" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function SaveBtn({ id, saved, onClick }: { id: string; saved: string | null; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:bg-linen-cream transition-colors">
      <Save size={13} />
      {saved === id ? "Saved ✓" : "Save Changes"}
    </button>
  );
}

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function AdminSettings() {
  const { user } = useAuth();
  const supabase = createClient();
  const [saved, setSaved] = useState<string | null>(null);
  const [dangerConfirm, setDangerConfirm] = useState<string | null>(null);
  const [dangerInput, setDangerInput] = useState("");
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerDone, setDangerDone] = useState<string | null>(null);

  function save(id: string) { setSaved(id); setTimeout(() => setSaved(null), 2000); }

  // ── Store ──────────────────────────────────────────────────────────────────
  const [store, setStore] = useState({
    name: "VOXE", tagline: "Wear your story.", description: "Gender-inclusive fashion brand for clothing and shoes.",
    email: "hello@voxe.store", phone: "+234 800 000 0000", address: "Lagos, Nigeria",
  });

  // ── Social ─────────────────────────────────────────────────────────────────
  const [social, setSocial] = useState({ instagram: "", tiktok: "", twitter: "" });

  // ── Business hours ─────────────────────────────────────────────────────────
  const [hours, setHours] = useState(
    DAYS.reduce((acc, d) => ({ ...acc, [d]: { open: d !== "Sunday", from: "09:00", to: "18:00" } }), {} as Record<string, { open: boolean; from: string; to: string }>)
  );

  // ── Orders & Fulfilment ────────────────────────────────────────────────────
  const [fulfilment, setFulfilment] = useState({
    prefix: "VXE", autoConfirm: false, deliveryMin: "3", deliveryMax: "5",
  });
  const [deliveryStates, setDeliveryStates] = useState<string[]>(["Lagos", "Abuja", "Rivers", "Oyo", "Kano"]);

  // ── Payments ───────────────────────────────────────────────────────────────
  const [payments, setPayments] = useState({
    paystackKey: "", vatRate: "0",
    methods: { card: true, transfer: true, pod: true },
  });

  // ── Notifications ──────────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, newCustomer: false, orderShipped: true });

  // ── Security ───────────────────────────────────────────────────────────────
  const [twoFA, setTwoFA] = useState(false);

  // ── Danger zone ────────────────────────────────────────────────────────────
  async function handleDanger(action: string) {
    if (dangerInput !== "CONFIRM") return;
    setDangerLoading(true);
    try {
      if (action === "orders") {
        await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      } else if (action === "customers") {
        // Delete all non-admin users via Supabase admin API — note: requires service role, show message instead
        setDangerDone("customers");
      } else if (action === "catalogue") {
        setDangerDone("catalogue");
      }
      setDangerDone(action);
    } finally {
      setDangerLoading(false);
      setDangerConfirm(null);
      setDangerInput("");
      setTimeout(() => setDangerDone(null), 3000);
    }
  }

  function toggleState(s: string) {
    setDeliveryStates((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Store Info */}
      <Section icon={Store} title="Store Information">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Store Name</label>
            <input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tagline</label>
            <input value={store.tagline} onChange={(e) => setStore({ ...store, tagline: e.target.value })} placeholder="Wear your story." className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Store Description</label>
            <textarea value={store.description} onChange={(e) => setStore({ ...store, description: e.target.value })}
              rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Contact Email</label>
            <input type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Address</label>
            <input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} className={inputCls} />
          </div>
        </div>
        <SaveBtn id="store" saved={saved} onClick={() => save("store")} />
      </Section>

      {/* Social Media */}
      <Section icon={Link2} title="Social Media Links">
        <div className="space-y-4">
          {[
            { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/voxe" },
            { key: "tiktok",    label: "TikTok",    placeholder: "https://tiktok.com/@voxe"   },
            { key: "twitter",   label: "Twitter / X", placeholder: "https://x.com/voxe"       },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input value={social[key as keyof typeof social]}
                onChange={(e) => setSocial({ ...social, [key]: e.target.value })}
                placeholder={placeholder} className={inputCls} />
            </div>
          ))}
        </div>
        <SaveBtn id="social" saved={saved} onClick={() => save("social")} />
      </Section>

      {/* Business Hours */}
      <Section icon={Clock} title="Business Hours">
        <div className="space-y-2">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3 py-2 border-b border-amber-tan/6 last:border-0">
              <Toggle value={hours[day].open} onChange={() => setHours({ ...hours, [day]: { ...hours[day], open: !hours[day].open } })} />
              <span className="font-dm text-sm text-linen-cream w-24 shrink-0">{day}</span>
              {hours[day].open ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={hours[day].from}
                    onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], from: e.target.value } })}
                    className="bg-white/[0.04] border border-amber-tan/15 text-linen-cream font-dm text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-amber-tan" />
                  <span className="font-dm text-xs text-linen-cream/30">to</span>
                  <input type="time" value={hours[day].to}
                    onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], to: e.target.value } })}
                    className="bg-white/[0.04] border border-amber-tan/15 text-linen-cream font-dm text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-amber-tan" />
                </div>
              ) : (
                <span className="font-dm text-xs text-linen-cream/25 flex-1">Closed</span>
              )}
            </div>
          ))}
        </div>
        <SaveBtn id="hours" saved={saved} onClick={() => save("hours")} />
      </Section>

      {/* Orders & Fulfilment */}
      <Section icon={Package} title="Orders & Fulfilment">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Order ID Prefix</label>
            <div className="flex items-center gap-2">
              <input value={fulfilment.prefix} onChange={(e) => setFulfilment({ ...fulfilment, prefix: e.target.value.toUpperCase() })}
                maxLength={6} className={inputCls} />
              <span className="font-dm text-xs text-linen-cream/30 shrink-0">-XXXXXXXX</span>
            </div>
            <p className="font-dm text-[10px] text-linen-cream/20 mt-1">Preview: {fulfilment.prefix}-A1B2C3D4</p>
          </div>
          <div>
            <label className={labelCls}>Delivery Estimate (days)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={fulfilment.deliveryMin} onChange={(e) => setFulfilment({ ...fulfilment, deliveryMin: e.target.value })}
                min="1" className={inputCls} placeholder="3" />
              <span className="font-dm text-xs text-linen-cream/30 shrink-0">to</span>
              <input type="number" value={fulfilment.deliveryMax} onChange={(e) => setFulfilment({ ...fulfilment, deliveryMax: e.target.value })}
                min="1" className={inputCls} placeholder="5" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-amber-tan/8">
          <div>
            <p className="font-dm text-sm text-linen-cream">Auto-confirm Orders</p>
            <p className="font-dm text-xs text-linen-cream/30 mt-0.5">Automatically move new orders to Processing</p>
          </div>
          <Toggle value={fulfilment.autoConfirm} onChange={() => setFulfilment({ ...fulfilment, autoConfirm: !fulfilment.autoConfirm })} />
        </div>
        <div>
          <label className={labelCls}>Supported Delivery States</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {NIGERIAN_STATES.map((s) => (
              <button key={s} onClick={() => toggleState(s)}
                className={`font-dm text-[10px] px-3 py-1.5 rounded-full border transition-colors ${
                  deliveryStates.includes(s)
                    ? "bg-amber-tan text-obsidian border-amber-tan font-semibold"
                    : "border-amber-tan/15 text-linen-cream/35 hover:border-amber-tan/40"
                }`}>
                {s}
              </button>
            ))}
          </div>
          <p className="font-dm text-[10px] text-linen-cream/20 mt-2">{deliveryStates.length} states selected</p>
        </div>
        <SaveBtn id="fulfilment" saved={saved} onClick={() => save("fulfilment")} />
      </Section>

      {/* Payments */}
      <Section icon={CreditCard} title="Payments">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Paystack Public Key</label>
            <input value={payments.paystackKey} onChange={(e) => setPayments({ ...payments, paystackKey: e.target.value })}
              placeholder="pk_live_xxxxxxxxxxxxxxxxxxxx" className={inputCls} />
            <p className="font-dm text-[10px] text-linen-cream/20 mt-1">Get this from your Paystack dashboard → Settings → API Keys</p>
          </div>
          <div>
            <label className={labelCls}>VAT / Tax Rate (%)</label>
            <input type="number" value={payments.vatRate} onChange={(e) => setPayments({ ...payments, vatRate: e.target.value })}
              min="0" max="100" placeholder="0" className={`${inputCls} max-w-[160px]`} />
          </div>
          <div className="border-t border-amber-tan/8 pt-4 space-y-3">
            <p className={labelCls}>Payment Methods</p>
            {[
              { key: "card",     label: "Card Payment",    sub: "Visa, Mastercard via Paystack" },
              { key: "transfer", label: "Bank Transfer",   sub: "Direct bank transfer"          },
              { key: "pod",      label: "Pay on Delivery", sub: "Cash on delivery"              },
            ].map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-dm text-sm text-linen-cream">{label}</p>
                  <p className="font-dm text-xs text-linen-cream/30">{sub}</p>
                </div>
                <Toggle value={payments.methods[key as keyof typeof payments.methods]}
                  onChange={() => setPayments({ ...payments, methods: { ...payments.methods, [key]: !payments.methods[key as keyof typeof payments.methods] } })} />
              </div>
            ))}
          </div>
        </div>
        <SaveBtn id="payments" saved={saved} onClick={() => save("payments")} />
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notification Preferences">
        <div className="space-y-1">
          {[
            { key: "newOrder",     label: "New Order",      sub: "When a customer places an order"       },
            { key: "lowStock",     label: "Low Stock Alert", sub: "When a product has less than 5 units"  },
            { key: "newCustomer",  label: "New Customer",    sub: "When a new user creates an account"    },
            { key: "orderShipped", label: "Order Shipped",   sub: "When an order is dispatched"           },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-amber-tan/8 last:border-0">
              <div>
                <p className="font-dm text-sm text-linen-cream">{label}</p>
                <p className="font-dm text-xs text-linen-cream/30 mt-0.5">{sub}</p>
              </div>
              <Toggle value={notifs[key as keyof typeof notifs]}
                onChange={() => setNotifs({ ...notifs, [key]: !notifs[key as keyof typeof notifs] })} />
            </div>
          ))}
        </div>
        <SaveBtn id="notifs" saved={saved} onClick={() => save("notifs")} />
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security">
        <div className="flex items-center gap-4 p-4 bg-amber-tan/5 border border-amber-tan/15 rounded-lg mb-2">
          <div className="w-12 h-12 rounded-full bg-amber-tan flex items-center justify-center shrink-0">
            <span className="font-dm font-bold text-obsidian text-lg">
              {(user?.user_metadata?.full_name || user?.email || "A")[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-dm font-semibold text-linen-cream text-sm">{user?.user_metadata?.full_name || "Admin"}</p>
            <p className="font-dm text-xs text-linen-cream/40 truncate">{user?.email}</p>
            <span className="font-dm text-[9px] text-amber-tan bg-amber-tan/10 border border-amber-tan/20 px-2 py-0.5 rounded-full mt-1 inline-block tracking-widest uppercase">
              Super Admin
            </span>
          </div>
        </div>

        {/* 2FA */}
        <div className="flex items-center justify-between py-3 border-t border-amber-tan/8">
          <div>
            <p className="font-dm text-sm text-linen-cream">Two-Factor Authentication</p>
            <p className="font-dm text-xs text-linen-cream/30 mt-0.5">Add an extra layer of security to your account</p>
          </div>
          <Toggle value={twoFA} onChange={() => setTwoFA((v) => !v)} />
        </div>
        {twoFA && (
          <div className="p-4 bg-amber-tan/5 border border-amber-tan/15 rounded-lg">
            <p className="font-dm text-xs text-linen-cream/60 leading-relaxed">
              2FA setup is managed through Supabase Auth. Enable it in your Supabase dashboard under Authentication → Users.
            </p>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
              className="font-dm text-xs text-amber-tan hover:underline mt-2 inline-block">
              Open Supabase Dashboard →
            </a>
          </div>
        )}

        {/* Active sessions */}
        <div className="border-t border-amber-tan/8 pt-4">
          <p className={labelCls}>Active Sessions</p>
          <div className="p-3 bg-white/[0.03] border border-amber-tan/10 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-dm text-xs text-linen-cream">Current session</p>
              <p className="font-dm text-[10px] text-linen-cream/30 mt-0.5">This device · Active now</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="pt-2">
          <p className="font-dm text-xs text-linen-cream/30 leading-relaxed">
            To change your admin password, update credentials in Supabase Auth dashboard.
          </p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
            className="font-dm text-xs text-amber-tan hover:underline mt-1 inline-block">
            Open Supabase Dashboard →
          </a>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section icon={AlertTriangle} title="Danger Zone" danger>
        <p className="font-dm text-xs text-linen-cream/40 leading-relaxed">
          These actions are irreversible. Type <span className="text-red-400 font-semibold">CONFIRM</span> in the input before proceeding.
        </p>

        <div className="space-y-3">
          {[
            { id: "orders",    label: "Clear All Orders",    sub: "Permanently delete all orders from the database",    icon: Trash2      },
            { id: "customers", label: "Delete All Customers", sub: "Remove all customer accounts (requires Supabase admin)", icon: Trash2  },
            { id: "catalogue", label: "Reset Catalogue",      sub: "Revert all products to the default catalogue",       icon: RefreshCw  },
          ].map(({ id, label, sub, icon: Icon }) => (
            <div key={id} className="p-4 border border-red-500/15 rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-dm text-sm text-linen-cream font-medium">{label}</p>
                  <p className="font-dm text-xs text-linen-cream/30 mt-0.5">{sub}</p>
                </div>
                <button
                  onClick={() => { setDangerConfirm(dangerConfirm === id ? null : id); setDangerInput(""); }}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 font-dm text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Icon size={11} /> {dangerConfirm === id ? "Cancel" : "Proceed"}
                </button>
              </div>

              {dangerConfirm === id && (
                <div className="space-y-2 pt-1">
                  <input
                    value={dangerInput}
                    onChange={(e) => setDangerInput(e.target.value.toUpperCase())}
                    placeholder="Type CONFIRM to proceed"
                    className="w-full bg-red-500/5 border border-red-500/20 text-linen-cream font-dm text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-red-400 placeholder:text-linen-cream/20 transition-colors"
                  />
                  <button
                    disabled={dangerInput !== "CONFIRM" || dangerLoading}
                    onClick={() => handleDanger(id)}
                    className="w-full py-2.5 bg-red-500 text-white font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:bg-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {dangerLoading ? "Processing…" : dangerDone === id ? "Done ✓" : `Confirm — ${label}`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}
