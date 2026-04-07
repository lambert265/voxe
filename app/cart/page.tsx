"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, Lock, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";

const PRODUCT_IMAGES: Record<number, string> = {
  1:  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=70",
  2:  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=70",
  3:  "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=200&q=70",
  4:  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&q=70",
  5:  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=70",
  6:  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&q=70",
  7:  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&q=70",
  8:  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=200&q=70",
  9:  "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=200&q=70",
  10: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&q=70",
  11: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&q=70",
  12: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=200&q=70",
  13: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&q=70",
  14: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&q=70",
  15: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&q=70",
  16: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&q=70",
  17: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200&q=70",
  18: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=70",
  19: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&q=70",
  20: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&q=70",
  21: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=200&q=70",
  22: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=70",
  23: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&q=70",
  24: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=70",
  25: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=70",
  26: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=200&q=70",
  27: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&q=70",
  28: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&q=70",
};

const PROMO_CODES: Record<string, number> = {
  VOXE10: 0.1, VOXE20: 0.2, WELCOME: 0.15,
};

const SHIPPING_COST = 3500;

export default function CartPage() {
  const { items, remove, update } = useCart();
  const { user, loading } = useAuth();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; rate: number } | null>(null);
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = SHIPPING_COST;
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0;
  const total = subtotal + shipping - discount;

  const cartIds = new Set(items.map((i) => i.id));
  const upsell = ALL_PRODUCTS.filter((p) => !cartIds.has(p.id)).slice(0, 4);

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    const rate = PROMO_CODES[code];
    if (rate) { setAppliedPromo({ code, rate }); setPromoStatus("success"); }
    else { setAppliedPromo(null); setPromoStatus("error"); }
  }

  const checkoutHref = !loading && user ? "/checkout" : "/auth";
  const checkoutLabel = !loading && user ? "Proceed to Checkout" : "Sign In to Checkout";

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-5 pt-[68px] px-6">
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none" className="opacity-20">
            <rect x="10" y="26" width="60" height="46" rx="4" stroke="#F0E6D3" strokeWidth="2.5" />
            <path d="M26 26V22a14 14 0 0 1 28 0v4" stroke="#F0E6D3" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="44" r="3" fill="#F0E6D3" />
            <circle cx="50" cy="44" r="3" fill="#F0E6D3" />
          </svg>
          <h2 className="font-dm text-3xl text-linen-cream">Your cart is empty</h2>
          <p className="font-dm text-linen-cream/35 text-sm">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop" className="mt-2 px-10 py-4 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
            Start Shopping
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-[68px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="font-dm text-3xl sm:text-4xl text-linen-cream mb-8"
          >
            Shopping Cart
            <span className="font-dm text-sm text-linen-cream/25 ml-3 font-normal">
              ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Cart items ── */}
            <div className="flex-[65] min-w-0">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-4 py-5 border-b border-white/8">
                      {/* Image */}
                      <div className="w-20 h-24 shrink-0 rounded-sm overflow-hidden bg-white/5">
                        {PRODUCT_IMAGES[item.id] ? (
                          <Image
                            src={PRODUCT_IMAGES[item.id]}
                            alt=""
                            width={80}
                            height={96}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={20} className="text-white/20" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-dm font-medium text-linen-cream text-sm leading-snug">{item.name}</p>
                          <button
                            onClick={() => remove(item.id, item.size, item.color)}
                            className="shrink-0 text-linen-cream/20 hover:text-red-400 transition-colors mt-0.5"
                            aria-label="Remove"
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <p className="font-dm text-linen-cream/35 text-xs mt-1">
                          {item.size} · {item.color}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          {/* Stepper */}
                          <div className="flex items-center border border-white/10 rounded-sm">
                            <button
                              onClick={() => update(item.id, item.size, item.color, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-linen-cream/40 hover:text-amber-tan transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-dm text-sm text-linen-cream select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => update(item.id, item.size, item.color, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-linen-cream/40 hover:text-amber-tan transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <p className="font-dm font-semibold text-linen-cream text-sm">
                            {formatNGN(item.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => remove(item.id, item.size, item.color)}
                          className="mt-2 font-dm text-xs text-linen-cream/20 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/shop" className="inline-block mt-6 font-dm text-xs text-amber-tan/60 hover:text-amber-tan transition-colors tracking-widest uppercase">
                ← Continue Shopping
              </Link>

              {/* You May Also Like */}
              {upsell.length > 0 && (
                <div className="mt-12">
                  <p className="font-dm text-xl text-linen-cream mb-5">You May Also Like</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {upsell.map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-white/5 rounded-sm">
                          <Image
                            src={PRODUCT_IMAGES[p.id] ?? ""}
                            alt={p.name}
                            fill
                            sizes="(max-width:640px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                        </div>
                        <p className="font-dm text-xs font-medium text-linen-cream group-hover:text-amber-tan transition-colors truncate">{p.name}</p>
                        <p className="font-dm text-xs text-linen-cream/35 mt-0.5">{formatNGN(p.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Order summary ── */}
            <div className="flex-[35] min-w-0">
              <div className="lg:sticky lg:top-[88px] bg-charcoal text-linen-cream rounded-xl p-5 space-y-4">
                <h2 className="font-dm text-xl">Order Summary</h2>

                <div className="space-y-2.5 font-dm text-sm">
                  <div className="flex justify-between">
                    <span className="text-linen-cream/55">Subtotal</span>
                    <span>{formatNGN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-linen-cream/55">Shipping</span>
                    <span>{formatNGN(shipping)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>−{formatNGN(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="font-dm font-semibold text-sm">Total</span>
                  <span className="font-dm font-bold text-amber-tan text-xl">{formatNGN(total)}</span>
                </div>

                {/* Promo */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={promo}
                      onChange={(e) => { setPromo(e.target.value); setPromoStatus("idle"); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Promo code"
                      className="flex-1 bg-white/8 border border-white/10 px-3 py-2 font-dm text-sm text-linen-cream placeholder:text-linen-cream/25 focus:outline-none focus:border-amber-tan transition-colors rounded-sm"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2 bg-amber-tan text-obsidian font-dm font-semibold text-xs uppercase hover:bg-linen-cream transition-colors rounded-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {promoStatus === "success" && (
                    <p className="font-dm text-xs text-emerald-400">✓ {Math.round((appliedPromo?.rate ?? 0) * 100)}% off applied</p>
                  )}
                  {promoStatus === "error" && (
                    <p className="font-dm text-xs text-red-400">✗ Invalid promo code</p>
                  )}
                </div>

                <Link
                  href={checkoutHref}
                  className="flex items-center justify-center w-full h-[52px] bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors rounded-sm"
                >
                  {checkoutLabel}
                </Link>

                <div className="flex items-center justify-center gap-2 text-linen-cream/25">
                  <Lock size={11} />
                  <span className="font-dm text-[11px]">Secure checkout · Paystack</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
