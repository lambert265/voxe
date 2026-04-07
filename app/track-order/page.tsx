"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { formatNGN } from "@/lib/products";

const STEPS = [
  { key: "Pending",    label: "Order Placed",  icon: Clock,        desc: "We've received your order and are preparing it." },
  { key: "Processing", label: "Processing",    icon: Package,      desc: "Your order is being packed and prepared for dispatch." },
  { key: "Shipped",    label: "Shipped",       icon: Truck,        desc: "Your order has left our warehouse and is on its way." },
  { key: "Delivered",  label: "Delivered",     icon: CheckCircle,  desc: "Your order has been delivered. Enjoy!" },
];

const STATUS_INDEX: Record<string, number> = {
  Pending: 0, Processing: 1, Shipped: 2, Delivered: 3,
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  delivery_address: string;
  tracking_note?: string;
  items: { name: string; size: string; color: string; quantity: number; price: number }[];
};

function TrackContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [input, setInput] = useState(searchParams.get("id") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) { setInput(id); handleTrack(id); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTrack(overrideId?: string) {
    const raw = (overrideId ?? input).trim().toUpperCase();
    if (!raw) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    // Try Supabase first
    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${raw},order_number.eq.${raw}`)
      .single();

    if (data) {
      setOrder(data as Order);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }

  const currentStep = order ? (STATUS_INDEX[order.status] ?? 0) : -1;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  }

  function shortId(id: string) {
    return id.startsWith("VXE-") ? id : `VXE-${id.slice(0, 8).toUpperCase()}`;
  }

  return (
    <main className="min-h-screen bg-obsidian">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-4">
          Order Tracking
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="font-playfair text-5xl md:text-6xl text-linen-cream mb-4">
          Track Your Order
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-dm text-linen-cream/40 text-base max-w-sm mx-auto mb-10">
          Enter your VXE order ID to see real-time delivery status.
        </motion.p>

        {/* Search input */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-linen-cream/25 pointer-events-none" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="VXE-XXXXXX"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-3.5 font-dm text-sm text-linen-cream placeholder:text-linen-cream/25 focus:outline-none focus:border-amber-tan/40 transition-colors tracking-widest uppercase"
            />
          </div>
          <button onClick={() => handleTrack()} disabled={loading || !input.trim()}
            className="btn-amber sheen px-6 py-3.5 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-full disabled:opacity-40 shrink-0">
            {loading ? "…" : "Track"}
          </button>
        </motion.div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-14 space-y-8">
        <AnimatePresence mode="wait">

          {/* Not found */}
          {notFound && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="card-gloss rounded-2xl p-8 text-center border border-red-500/15">
              <p className="font-playfair text-xl text-linen-cream mb-2">Order not found</p>
              <p className="font-dm text-sm text-linen-cream/40 mb-1">
                No order found for <span className="text-amber-tan font-semibold">{input.trim().toUpperCase()}</span>.
              </p>
              <p className="font-dm text-xs text-linen-cream/25">Check your confirmation email for the correct order ID.</p>
            </motion.div>
          )}

          {/* Result */}
          {order && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">

              {/* Order summary card */}
              <div className="card-gloss rounded-2xl p-6 border border-amber-tan/10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-dm text-xl font-semibold text-linen-cream">{shortId(order.id)}</p>
                  </div>
                  <span className={`font-dm text-[9px] tracking-wider uppercase px-3 py-1.5 rounded-full border ${
                    order.status === "Delivered"  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
                    order.status === "Shipped"    ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
                    order.status === "Processing" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
                    "bg-linen-cream/8 text-linen-cream/40 border-linen-cream/12"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 font-dm text-sm border-t border-amber-tan/8 pt-4">
                  <div className="flex justify-between">
                    <span className="text-linen-cream/40">Order Date</span>
                    <span className="text-linen-cream">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-linen-cream/40">Total</span>
                    <span className="text-amber-tan font-semibold">{formatNGN(order.total)}</span>
                  </div>
                  {order.tracking_note && (
                    <div className="flex justify-between">
                      <span className="text-linen-cream/40">Update</span>
                      <span className="text-linen-cream text-right max-w-[60%]">{order.tracking_note}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin size={12} className="text-amber-tan shrink-0 mt-0.5" />
                    <span className="text-linen-cream/40 text-xs">{order.delivery_address}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card-gloss rounded-2xl p-6 border border-amber-tan/10">
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-6">Delivery Progress</p>
                <div className="space-y-0">
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: done ? 1 : 0.9 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                              active ? "bg-amber-tan text-obsidian ring-4 ring-amber-tan/20" :
                              done  ? "bg-amber-tan/20 text-amber-tan border border-amber-tan/40" :
                              "bg-white/5 text-linen-cream/20 border border-white/8"
                            }`}>
                            <Icon size={16} />
                          </motion.div>
                          {i < STEPS.length - 1 && (
                            <div className={`w-px my-1 transition-colors duration-500 ${i < currentStep ? "bg-amber-tan/50" : "bg-white/8"}`}
                              style={{ minHeight: 32 }} />
                          )}
                        </div>
                        <div className="pb-8 pt-1.5">
                          <p className={`font-dm font-semibold text-sm ${done ? "text-linen-cream" : "text-linen-cream/25"}`}>
                            {step.label}
                          </p>
                          {active && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                              className="font-dm text-xs text-linen-cream/45 mt-0.5 leading-relaxed">
                              {step.desc}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              {order.items?.length > 0 && (
                <div className="card-gloss rounded-2xl p-6 border border-amber-tan/10">
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-4">Items in This Order</p>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-dm text-sm text-linen-cream">{item.name}</p>
                          <p className="font-dm text-xs text-linen-cream/35 mt-0.5">
                            Size {item.size} · {item.color} · ×{item.quantity}
                          </p>
                        </div>
                        <p className="font-dm text-sm text-amber-tan">{formatNGN(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help */}
        {!order && !notFound && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-center pt-4 space-y-4">
            <p className="font-dm text-xs text-linen-cream/20">Your order ID is in your confirmation email and starts with VXE-</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-amber-tan/20 text-amber-tan font-dm text-[11px] tracking-[0.15em] uppercase hover:bg-amber-tan/10 transition-colors rounded-sm">
                View My Orders <ArrowRight size={12} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/8 text-linen-cream/40 font-dm text-[11px] tracking-[0.15em] uppercase hover:border-white/20 hover:text-linen-cream/60 transition-colors rounded-sm">
                Contact Support
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-obsidian pt-[68px]" />}>
        <TrackContent />
      </Suspense>
      <Footer />
    </>
  );
}
