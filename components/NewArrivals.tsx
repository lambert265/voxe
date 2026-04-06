"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hidden, visibleFadeUp, staggerContainer, scaleInVariant } from "@/lib/motion";
import { ALL_PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { triggerCartToast } from "@/components/CartToast";

const PRODUCT_IDS = [1, 24, 19, 9, 3, 23, 15, 10];
const products = ALL_PRODUCTS.filter((p) => PRODUCT_IDS.includes(p.id))
  .sort((a, b) => PRODUCT_IDS.indexOf(a.id) - PRODUCT_IDS.indexOf(b.id));

const IMGS: Record<number, string> = {
  1:  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=75",
  24: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75",
  19: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=75",
  9:  "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=75",
  3:  "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=75",
  23: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=75",
  15: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=75",
  10: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=75",
};

function ProductCard({ p }: { p: typeof products[0] }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSizes(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelectSize(e: React.MouseEvent, size: string) {
    e.preventDefault(); e.stopPropagation();
    add({ id: p.id, name: p.name, price: p.price, size, color: p.colors[0], bg: p.bg });
    triggerCartToast({ name: p.name, size, color: p.colors[0] });
    setShowSizes(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <motion.article variants={scaleInVariant} className="group cursor-pointer relative" ref={ref}>
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-charcoal rounded-sm border border-amber-tan/10">
        <Link href={`/product/${p.id}`} className="block w-full h-full">
          <Image src={IMGS[p.id]} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]" />
        </Link>
        {p.tag && (
          <span className="absolute top-3 left-3 bg-amber-tan text-obsidian px-2.5 py-1 rounded-full font-dm text-[9px] tracking-[0.15em] uppercase z-10 pointer-events-none font-semibold">
            {p.tag}
          </span>
        )}
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(p.id); }}
          className="absolute top-3 right-3 w-8 h-8 glass-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
          <Heart size={13} className={has(p.id) ? "fill-amber-tan text-amber-tan" : "text-linen-cream/60"} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes((v) => !v); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes((v) => !v); }}
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-obsidian/90 border-t border-amber-tan/20 text-amber-tan font-dm text-[10px] tracking-[0.18em] uppercase py-3.5 z-10 sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-300">
          {added ? "Added ✓" : "Quick Add"}
        </button>
        <AnimatePresence>
          {showSizes && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}
              className="absolute bottom-12 left-0 right-0 z-20 bg-obsidian border border-amber-tan/20 px-3 py-3">
              <p className="font-dm text-[9px] text-amber-tan/60 uppercase tracking-widest mb-2">Select size</p>
              <div className="flex flex-wrap gap-1.5">
                {p.sizes.map((s) => (
                  <button key={s} onClick={(e) => handleSelectSize(e, s)} onTouchEnd={(e) => handleSelectSize(e, s)}
                    className="font-dm text-[10px] px-2.5 py-1.5 border border-amber-tan/25 text-linen-cream/70 hover:bg-amber-tan hover:text-obsidian hover:border-amber-tan transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link href={`/product/${p.id}`}>
        <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.18em] mb-1 capitalize">{p.gender} · {p.type}</p>
        <h3 className="font-dm text-sm font-medium text-linen-cream group-hover:text-amber-tan transition-colors duration-200 mb-1 leading-snug">{p.name}</h3>
        <p className="font-dm text-sm text-linen-cream/40">₦{p.price.toLocaleString()}</p>
      </Link>
    </motion.article>
  );
}

export default function NewArrivals() {
  return (
    <section id="new-arrivals" className="py-24 md:py-32 px-6 bg-obsidian border-t border-amber-tan/10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={hidden} whileInView={visibleFadeUp(0)} viewport={{ once: true, margin: "-80px" }}
          className="flex items-end justify-between mb-14">
          <div>
            <p className="font-dm text-amber-tan text-[10px] tracking-[0.35em] uppercase mb-2">Just Dropped</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-linen-cream">New Arrivals</h2>
          </div>
          <Link href="/shop?sort=newest" className="hidden sm:flex items-center gap-1.5 font-dm text-xs text-linen-cream/35 hover:text-amber-tan transition-colors duration-200">
            View All <ArrowRight size={12} />
          </Link>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </motion.div>
      </div>
    </section>
  );
}
