"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";
import { triggerCartToast } from "@/components/CartToast";

const IMGS: Record<number, string> = {
  1:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=75",
  2:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=75",
  3:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75",
  4:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=75",
  5:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75",
  6:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=75",
  7:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=75",
  8:"https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=75",
  9:"https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=75",
  10:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=75",
  11:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=75",
  12:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=75",
  13:"https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=75",
  14:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=75",
  15:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=75",
  16:"https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=75",
  17:"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=75",
  18:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=75",
  19:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75",
  20:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=75",
  21:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=75",
  22:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=75",
  23:"https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=75",
  24:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75",
  25:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=75",
  26:"https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&q=75",
  27:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=75",
  28:"https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=75",
};

export default function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const { add } = useCart();
  const items = ALL_PRODUCTS.filter((p) => ids.includes(p.id));

  function handleAddToCart(p: typeof items[0]) {
    add({ id: p.id, name: p.name, price: p.price, size: p.sizes[0], color: p.colors[0], bg: p.bg });
    triggerCartToast({ name: p.name, size: p.sizes[0], color: p.colors[0] });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-off-white pt-[68px]">
        <div className="bg-charcoal py-14 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Heart size={20} className="text-amber-tan" />
            <h1 className="font-playfair text-4xl md:text-5xl text-linen-cream">Wishlist</h1>
            {items.length > 0 && (
              <span className="font-dm text-sm text-linen-cream/35 ml-1">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Heart size={48} className="text-charcoal/10 mb-6" />
              <h2 className="font-playfair text-3xl text-charcoal mb-3">Your wishlist is empty</h2>
              <p className="font-dm text-sm text-charcoal/40 mb-8">
                Save pieces you love and come back to them anytime.
              </p>
              <Link href="/shop"
                className="btn-amber sheen px-10 py-4 text-white font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
                Browse Shop
              </Link>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence>
                {items.map((p) => (
                  <motion.div
                    key={p.id} layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="group relative"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/5 rounded-sm border border-charcoal/8 mb-3">
                      <Link href={`/product/${p.id}`}>
                        <Image src={IMGS[p.id] ?? ""} alt={p.name} fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]" />
                      </Link>
                      <button onClick={() => toggle(p.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10"
                        aria-label="Remove from wishlist">
                        <X size={13} className="text-charcoal/50" />
                      </button>
                    </div>
                    <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.18em] mb-1 capitalize">
                      {p.gender} · {p.subtype}
                    </p>
                    <Link href={`/product/${p.id}`}>
                      <h3 className="font-dm text-sm font-medium text-charcoal hover:text-amber-tan transition-colors leading-snug mb-1">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="font-dm text-sm text-charcoal/45 mb-3">{formatNGN(p.price)}</p>
                    <button onClick={() => handleAddToCart(p)}
                      className="w-full flex items-center justify-center gap-2 border border-charcoal/20 py-2.5 font-dm text-[10px] tracking-[0.18em] uppercase text-charcoal hover:bg-charcoal hover:text-off-white transition-colors duration-200 rounded-sm">
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
