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
  3:  "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&q=70",
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
  VOXE10: 0.1,
  VOXE20: 0.2,
  WELCOME: 0.15,
};

const SHIPPING_COST = 3500;

function OrderSummary({
  subtotal, shipping, discount, total, appliedPromo,
  promo, setPromo, promoStatus, setPromoStatus, applyPromo, ctaHref, ctaLabel, user,
}: {
  subtotal: number; shipping: number; discount: number; total: number;
  appliedPromo: { code: string; rate: number } | null;
  promo: string; setPromo: (v: string) => void;
  promoStatus: "idle" | "success" | "error";
  setPromoStatus: (v: "idle" | "success" | "error") => void;
  applyPromo: () => void; ctaHref: string; ctaLabel: string;
  user: { email?: string | null } | null;
}) {
  const [promoOpen, setPromoOpen] = useState(false);
  return (
    <div className="sticky top-[88px] bg-charcoal text-linen-cream rounded-xl p-6 space-y-5">
      <h2 className="font-playfair text-xl">Order Summary</h2>

      <div className="space-y-3 font-dm text-sm">
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

      <div className="border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="font-dm font-semibold text-sm">Total</span>
        <span className="font-dm font-bold text-amber-tan text-xl">{formatNGN(total)}</span>
      </div>

      {/* Promo */}
      <div className="space-y-2">
        <button
          onClick={() => setPromoOpen((v) => !v)}
          className="font-dm text-xs text-charcoal/50 hover:text-amber-tan transition-colors flex items-center gap-1"
        >
          {promoOpen ? "− " : "+ "}Have a promo code?
        </button>
        {promoOpen && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                value={promo}
                onChange={(e) => { setPromo(e.target.value); setPromoStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                placeholder="Promo code"
                className="flex-1 bg-white border border-charcoal/15 px-3 py-2.5 font-dm text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-amber-tan transition-colors rounded-sm"
              />
              <button
                onClick={applyPromo}
                className="px-4 py-2 bg-amber-tan text-white font-dm font-semibold text-xs tracking-wider uppercase hover:bg-charcoal transition-colors rounded-sm"
              >
                Apply
              </button>
            </div>
            {promoStatus === "success" && (
              <p className="font-dm text-xs text-emerald-600">✓ {Math.round((appliedPromo?.rate ?? 0) * 100)}% discount applied</p>
            )}
            {promoStatus === "error" && (
              <p className="font-dm text-xs text-red-500">✗ Invalid promo code</p>
            )}
          </div>
        )}
      </div>

      <Link
        href={user ? ctaHref : "/auth"}
        className="flex items-center justify-center w-full h-[52px] bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors duration-300 rounded-sm"
      >
        {user ? ctaLabel : "Sign In to Checkout"}
      </Link>

      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 text-linen-cream/30">
          <Lock size={11} />
          <span className="font-dm text-[11px]">Secure checkout</span>
        </div>
        <span className="text-linen-cream/15 text-xs">|</span>
        <span className="font-dm text-[11px] text-linen-cream/30 font-semibold tracking-wider">Paystack</span>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, remove, update } = useCart();
  const { user } = useAuth();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; rate: number } | null>(null);
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = SHIPPING_COST;
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0;
  const total = subtotal + shipping - discount;

  // Upsell: products not already in cart
  const cartIds = new Set(items.map((i) => i.id));
  const upsell = ALL_PRODUCTS.filter((p) => !cartIds.has(p.id)).slice(0, 4);

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    const rate = PROMO_CODES[code];
    if (rate) { setAppliedPromo({ code, rate }); setPromoStatus("success"); }
    else { setAppliedPromo(null); setPromoStatus("error"); }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-5 pt-[68px]">
          <div className="card-gloss rounded-2xl p-14 flex flex-col items-center gap-5 text-center">
            <svg width="64" height="64" viewBox="0 0 80 80" fill="none" className="opacity-20">
              <rect x="10" y="26" width="60" height="46" rx="4" stroke="#F0E6D3" strokeWidth="2.5" />
              <path d="M26 26V22a14 14 0 0 1 28 0v4" stroke="#F0E6D3" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="44" r="3" fill="#F0E6D3" />
              <circle cx="50" cy="44" r="3" fill="#F0E6D3" />
            </svg>
            <h2 className="font-playfair text-3xl text-linen-cream">Your cart is empty</h2>
            <p className="font-dm text-linen-cream/35 text-sm">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop"
              className="mt-2 btn-amber sheen px-10 py-4 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-[68px]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="font-playfair text-4xl text-linen-cream mb-10">
            Shopping Cart
            <span className="font-dm text-base text-linen-cream/25 ml-3 font-normal">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-10 pb-24 lg:pb-0">
            {/* Left — cart items */}
            <div className="flex-[65] min-w-0">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex gap-5 py-6 border-b border-white/6 overflow-hidden"
                  >
                    <div className="w-20 h-24 shrink-0 overflow-hidden bg-charcoal-2 rounded-sm ring-1 ring-white/8">
                      {PRODUCT_IMAGES[item.id] ? (
                        <Image
                          src={PRODUCT_IMAGES[item.id]}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className={`w-full h-full ${item.bg} flex items-center justify-center`}>
                          <ShoppingBag size={20} className="text-charcoal/25" />
                        </div>
                      )}
                    </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <p className="font-dm font-medium text-linen-cream text-[15px] leading-snug">{item.name}</p>
                        <p className="font-dm text-linen-cream/35 text-xs mt-1 tracking-wide">Size: {item.size} &nbsp;·&nbsp; Color: {item.color}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center glass-dark rounded-full overflow-hidden">
                            <button onClick={() => update(item.id, item.size, item.color, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-linen-cream/50 hover:text-amber-tan transition-colors">
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-dm text-sm text-linen-cream select-none">{item.quantity}</span>
                            <button onClick={() => update(item.id, item.size, item.color, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-linen-cream/50 hover:text-amber-tan transition-colors">
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-dm font-semibold text-linen-cream text-[15px]">{formatNGN(item.price * item.quantity)}</p>
                        </div>
                      </div>

                    <button onClick={() => remove(item.id, item.size, item.color)}
                      className="absolute top-6 right-0 text-linen-cream/20 hover:text-red-400 transition-colors" aria-label="Remove item">
                      <X size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/shop" className="inline-block mt-7 font-dm text-xs text-amber-tan/70 hover:text-amber-tan transition-colors tracking-widest uppercase">
                ← Continue Shopping
              </Link>

              {upsell.length > 0 && (
                <div className="mt-14">
                  <p className="font-playfair text-2xl text-linen-cream mb-6">You May Also Like</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {upsell.map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-charcoal-2 rounded-sm ring-1 ring-white/5">
                          <Image src={PRODUCT_IMAGES[p.id] ?? ""} alt={p.name} fill sizes="(max-width:640px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <p className="font-dm text-xs font-medium text-linen-cream group-hover:text-amber-tan transition-colors leading-snug truncate">{p.name}</p>
                        <p className="font-dm text-xs text-linen-cream/35 mt-0.5">{formatNGN(p.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — order summary */}
            <div className="flex-[35] min-w-0">
              {/* Mobile sticky checkout bar */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-dm text-xs text-linen-cream/40">Total</p>
                  <p className="font-dm font-bold text-amber-tan text-lg">{formatNGN(total)}</p>
                </div>
                <Link
                  href={user ? "/checkout" : "/auth"}
                  className="flex-1 max-w-[200px] h-[48px] flex items-center justify-center bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors rounded-sm"
                >
                  {user ? "Checkout" : "Sign In to Checkout"}
                </Link>
              </div>
              {/* Desktop order summary */}
              <div className="hidden lg:block">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                appliedPromo={appliedPromo}
                promo={promo}
                setPromo={setPromo}
                promoStatus={promoStatus}
                setPromoStatus={setPromoStatus}
                applyPromo={applyPromo}
                ctaHref="/checkout"
                ctaLabel="Proceed to Checkout"
                user={user}
              />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
