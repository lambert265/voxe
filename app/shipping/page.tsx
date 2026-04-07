import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, RefreshCw, Truck, CreditCard } from "lucide-react";

const returnSteps = [
  { n: "01", title: "Initiate Return",   body: "Email hello@voxe.com within 30 days of delivery with your order number and reason for return." },
  { n: "02", title: "Pack Your Item",    body: "Place the item in its original packaging. Include your order slip inside." },
  { n: "03", title: "Drop Off",          body: "Drop the parcel at any GIG Logistics or DHL outlet near you. We'll send you the return address." },
  { n: "04", title: "Refund Processed",  body: "Once we receive and inspect the item, your refund is processed within 3–5 business days." },
];

const refundOptions = [
  { icon: CreditCard, label: "Original Payment", desc: "Refunded to your card or bank account within 3–5 business days." },
  { icon: Package,    label: "Store Credit",      desc: "Instant credit added to your VOXE account — never expires." },
  { icon: RefreshCw,  label: "Exchange",          desc: "Swap for a different size or colour. We ship the replacement free." },
];

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center border-b border-amber-tan/8">
          <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-4">Delivery & Returns</p>
          <h1 className="font-playfair text-5xl md:text-6xl text-linen-cream mb-4">Shipping & Returns</h1>
          <p className="font-dm text-linen-cream/40 text-base max-w-sm mx-auto">
            Fast delivery across Nigeria. Hassle-free returns within 30 days.
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

          {/* Shipping info */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Truck size={18} className="text-amber-tan" />
              <h2 className="font-playfair text-2xl text-linen-cream">Delivery</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { location: "Lagos",          time: "3–5 business days",  cost: "₦3,500 flat rate" },
                { location: "Nationwide",     time: "5–7 business days",  cost: "₦3,500 flat rate" },
              ].map((row) => (
                <div key={row.location} className="card-gloss rounded-xl p-6 border border-amber-tan/10">
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">{row.location}</p>
                  <p className="font-playfair text-2xl text-linen-cream mb-1">{row.time}</p>
                  <p className="font-dm text-sm text-linen-cream/40">{row.cost}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-xl border border-amber-tan/10 bg-amber-tan/4">
              <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-3">Important Notes</p>
              <ul className="font-dm text-sm text-linen-cream/50 space-y-2 leading-relaxed">
                <li className="flex gap-2"><span className="text-amber-tan shrink-0">·</span> Orders placed before 2pm on weekdays are dispatched same day.</li>
                <li className="flex gap-2"><span className="text-amber-tan shrink-0">·</span> Weekend orders are processed the next business day.</li>
                <li className="flex gap-2"><span className="text-amber-tan shrink-0">·</span> Delivery times are estimates and may vary during peak periods.</li>
                <li className="flex gap-2"><span className="text-amber-tan shrink-0">·</span> You will receive an SMS and email with your tracking number once dispatched.</li>
              </ul>
            </div>
          </section>

          {/* Returns */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw size={18} className="text-amber-tan" />
              <h2 className="font-playfair text-2xl text-linen-cream">Returns Policy</h2>
            </div>
            <p className="font-dm text-linen-cream/45 text-sm mb-8 leading-relaxed">
              We accept returns within <span className="text-linen-cream font-semibold">30 days</span> of delivery for items that are unworn, unwashed, and in original condition with tags attached. Sale items and underwear are non-returnable.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {returnSteps.map((step) => (
                <div key={step.n} className="card-gloss rounded-xl p-6 border border-amber-tan/10 flex gap-4">
                  <span className="font-playfair text-3xl text-amber-tan/40 shrink-0 leading-none">{step.n}</span>
                  <div>
                    <p className="font-dm text-sm font-semibold text-linen-cream mb-1">{step.title}</p>
                    <p className="font-dm text-xs text-linen-cream/40 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Refund options */}
          <section>
            <h2 className="font-playfair text-2xl text-linen-cream mb-6">Refund Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {refundOptions.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="card-gloss rounded-xl p-6 border border-amber-tan/10 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-tan/10 border border-amber-tan/20 flex items-center justify-center">
                    <Icon size={16} className="text-amber-tan" />
                  </div>
                  <p className="font-dm text-sm font-semibold text-linen-cream">{label}</p>
                  <p className="font-dm text-xs text-linen-cream/40 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center py-8 border-t border-amber-tan/8">
            <p className="font-dm text-sm text-linen-cream/35 mb-5">Need help with a return or delivery issue?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact"
                className="btn-amber sheen inline-flex items-center justify-center px-8 py-3.5 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
                Contact Us
              </Link>
              <Link href="/track-order"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-amber-tan/25 text-amber-tan font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm hover:bg-amber-tan/10 transition-colors">
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
