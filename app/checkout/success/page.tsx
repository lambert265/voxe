"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("order") ?? "";
  const supabase = createClient();

  // Format the UUID into a short display ID like VXE-XXXX
  const displayId = rawId ? `VXE-${rawId.slice(0, 8).toUpperCase()}` : "";
  const delivery = getEstimatedDelivery();

  const [order, setOrder] = useState<{ id: string; total: number; status: string } | null>(null);

  useEffect(() => {
    if (!rawId) return;
    supabase
      .from("orders")
      .select("id, total, status")
      .eq("id", rawId)
      .single()
      .then(({ data }) => { if (data) setOrder(data); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawId]);

  return (
    <main className="min-h-screen bg-off-white pt-[68px] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <motion.svg viewBox="0 0 96 96" fill="none" className="w-24 h-24 absolute inset-0">
              <motion.circle cx="48" cy="48" r="44" stroke="#B5906A" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }} />
            </motion.svg>
            <motion.svg viewBox="0 0 96 96" fill="none" className="w-24 h-24 absolute inset-0">
              <motion.path d="M28 50l14 14 26-28" stroke="#B5906A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }} />
            </motion.svg>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
          <h1 className="font-dm text-4xl text-charcoal mb-3">Order Confirmed!</h1>
          <p className="font-dm text-charcoal/50 text-sm mb-6 leading-relaxed">
            Thank you for your order. We&apos;ve received it and will begin processing shortly.
          </p>

          <div className="bg-white border border-charcoal/10 rounded-sm px-6 py-5 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-dm text-xs text-charcoal/40 uppercase tracking-widest">Order ID</span>
              <span className="font-dm font-bold text-amber-tan text-sm tracking-wider">
                {displayId || "—"}
              </span>
            </div>
            {order && (
              <div className="flex justify-between items-center border-t border-charcoal/8 pt-3">
                <span className="font-dm text-xs text-charcoal/40 uppercase tracking-widest">Status</span>
                <span className="font-dm text-sm text-charcoal font-medium">{order.status}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-charcoal/8 pt-3">
              <span className="font-dm text-xs text-charcoal/40 uppercase tracking-widest">Est. Delivery</span>
              <span className="font-dm text-sm text-charcoal font-medium">{delivery}</span>
            </div>
          </div>

          <p className="font-dm text-xs text-charcoal/35 mb-8 leading-relaxed">
            A confirmation has been recorded. Use your Order ID to track your delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop"
              className="flex-1 h-[52px] flex items-center justify-center bg-obsidian text-linen-cream font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-amber-tan hover:text-obsidian transition-colors duration-300 rounded-sm">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-off-white pt-[68px]" />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
