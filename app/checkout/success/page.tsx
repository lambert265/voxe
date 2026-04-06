"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VXE-${ts.slice(-4)}${rand}`;
}

export default function SuccessPage() {
  const [orderNo] = useState(() => {
    // Reuse existing order ID if already generated this session
    if (typeof window !== "undefined") {
      const existing = sessionStorage.getItem("voxe_order_id");
      if (existing) return existing;
      const id = generateOrderId();
      sessionStorage.setItem("voxe_order_id", id);
      // Also persist to localStorage for track-order page
      try {
        const orders: string[] = JSON.parse(localStorage.getItem("voxe_order_ids") ?? "[]");
        if (!orders.includes(id)) {
          orders.unshift(id);
          localStorage.setItem("voxe_order_ids", JSON.stringify(orders.slice(0, 20)));
        }
      } catch {}
      return id;
    }
    return "VXE-XXXXXX";
  });
  const [delivery] = useState(getEstimatedDelivery);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Clear session order ID after mounting so next order gets a fresh one
    return () => sessionStorage.removeItem("voxe_order_id");
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-[68px] flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <motion.svg viewBox="0 0 96 96" fill="none" className="w-24 h-24 absolute inset-0">
                <motion.circle cx="48" cy="48" r="44" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }} />
              </motion.svg>
              <motion.svg viewBox="0 0 96 96" fill="none" className="w-24 h-24 absolute inset-0">
                <motion.path d="M28 50l14 14 26-28" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }} />
              </motion.svg>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
            <h1 className="font-playfair text-4xl text-linen-cream mb-3">Order Confirmed!</h1>
            <p className="font-dm text-linen-cream/45 text-sm mb-6 leading-relaxed">
              Thank you for your order. We&apos;ve received it and will begin processing shortly.
            </p>

            <div className="card-gloss border border-amber-tan/15 rounded-sm px-6 py-5 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-dm text-xs text-linen-cream/35 uppercase tracking-widest">Order / Tracking ID</span>
                <span className="font-dm font-bold text-amber-tan text-sm tracking-wider">
                  {mounted ? orderNo : "VXE-XXXXXX"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-amber-tan/10 pt-3">
                <span className="font-dm text-xs text-linen-cream/35 uppercase tracking-widest">Est. Delivery</span>
                <span className="font-dm text-sm text-linen-cream font-medium">
                  {mounted ? delivery : "—"}
                </span>
              </div>
            </div>

            <p className="font-dm text-xs text-linen-cream/30 mb-8 leading-relaxed">
              Use your Order ID above to track your delivery status.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/track-order?id=${mounted ? orderNo : ""}`}
                className="flex-1 h-[52px] flex items-center justify-center border-2 border-amber-tan text-amber-tan font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-amber-tan hover:text-obsidian transition-colors duration-300 rounded-sm">
                Track Order
              </Link>
              <Link href="/shop"
                className="flex-1 h-[52px] flex items-center justify-center bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors duration-300 rounded-sm">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
