"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

const MOCK_ORDERS: Record<string, {
  status: "processing" | "dispatched" | "in-transit" | "delivered";
  product: string; date: string; eta: string; location: string;
}> = {
  "VXE-ABC123": { status: "in-transit",  product: "Obsidian Trench Coat (M · Black)", date: "12 Jan 2025", eta: "14 Jan 2025", location: "GIG Hub — Ikeja, Lagos" },
  "VXE-DEF456": { status: "delivered",   product: "Silk Wrap Dress (S · Cream)",      date: "8 Jan 2025",  eta: "10 Jan 2025", location: "Delivered" },
  "VXE-GHI789": { status: "processing",  product: "Suede Chelsea Boots (EU 42 · Tan)", date: "13 Jan 2025", eta: "16 Jan 2025", location: "VOXE Warehouse" },
  "VXE-JKL012": { status: "dispatched",  product: "Linen Co-ord Set (M · Olive)",     date: "11 Jan 2025", eta: "13 Jan 2025", location: "DHL Sorting — Abuja" },
};

const STEPS = [
  { key: "processing", label: "Order Placed",  icon: Clock,       desc: "We've received your order and are preparing it." },
  { key: "dispatched", label: "Dispatched",    icon: Package,     desc: "Your order has left our warehouse." },
  { key: "in-transit", label: "In Transit",    icon: Truck,       desc: "Your order is on its way to you." },
  { key: "delivered",  label: "Delivered",     icon: CheckCircle, desc: "Your order has been delivered." },
];

const STATUS_ORDER = ["processing", "dispatched", "in-transit", "delivered"];

export default function TrackOrderPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<typeof MOCK_ORDERS[string] | null | "not-found">(null);

  function handleTrack() {
    const key = input.trim().toUpperCase();
    const found = MOCK_ORDERS[key];
    setResult(found ?? "not-found");
  }

  const currentStep = result && result !== "not-found"
    ? STATUS_ORDER.indexOf(result.status)
    : -1;

  return (
    <>
      <Navbar />
      <div className="bg-off-white pt-28 pb-14 text-center px-6">
        <h1 className="font-dm text-5xl md:text-6xl text-charcoal mb-4">Track Your Order</h1>
        <p className="font-dm text-charcoal/50 text-lg max-w-md mx-auto">
          Enter your order number to see real-time delivery status.
        </p>
      </div>

      <main className="max-w-xl mx-auto px-6 pb-24 space-y-10">
        {/* Input */}
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="e.g. VXE-ABC123"
            className="flex-1 border border-charcoal/15 bg-white px-4 py-3.5 font-dm text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-amber-tan transition-colors rounded-sm"
          />
          <button
            onClick={handleTrack}
            className="px-6 py-3.5 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300 rounded-sm flex items-center gap-2"
          >
            <Search size={14} /> Track
          </button>
        </div>

        {/* Not found */}
        {result === "not-found" && (
          <div className="bg-white border border-red-100 rounded-sm p-6 text-center">
            <p className="font-dm text-sm text-charcoal/60">No order found for <strong className="text-charcoal">{input.trim().toUpperCase()}</strong>.</p>
            <p className="font-dm text-xs text-charcoal/40 mt-1">Check your confirmation email for the correct order number.</p>
          </div>
        )}

        {/* Result */}
        {result && result !== "not-found" && (
          <div className="space-y-8">
            {/* Order info */}
            <div className="bg-white border border-linen-cream rounded-sm p-6 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-1">Order Number</p>
                  <p className="font-dm text-xl text-charcoal">{input.trim().toUpperCase()}</p>
                </div>
                <span className={`font-dm text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full ${
                  result.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                  result.status === "in-transit" ? "bg-amber-50 text-amber-700" :
                  "bg-charcoal/5 text-charcoal/50"
                }`}>
                  {result.status.replace("-", " ")}
                </span>
              </div>
              <div className="border-t border-charcoal/8 pt-3 space-y-1.5 font-dm text-sm">
                <p className="text-charcoal/55">Product: <span className="text-charcoal">{result.product}</span></p>
                <p className="text-charcoal/55">Order Date: <span className="text-charcoal">{result.date}</span></p>
                <p className="text-charcoal/55">Est. Delivery: <span className="text-charcoal">{result.eta}</span></p>
                <p className="text-charcoal/55">Current Location: <span className="text-charcoal">{result.location}</span></p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        done ? "bg-amber-tan text-obsidian" : "bg-charcoal/8 text-charcoal/25"
                      }`}>
                        <Icon size={16} />
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-px flex-1 my-1 ${i < currentStep ? "bg-amber-tan" : "bg-charcoal/10"}`} style={{ minHeight: 32 }} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`font-dm font-semibold text-sm ${done ? "text-charcoal" : "text-charcoal/30"}`}>{step.label}</p>
                      {active && <p className="font-dm text-xs text-charcoal/50 mt-0.5 leading-relaxed">{step.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demo hint */}
        <p className="font-dm text-xs text-charcoal/30 text-center">
          Try: VXE-ABC123 · VXE-DEF456 · VXE-GHI789 · VXE-JKL012
        </p>
      </main>
      <Footer />
    </>
  );
}
