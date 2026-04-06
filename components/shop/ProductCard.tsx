"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, formatNGN } from "@/lib/products";
import { useCart } from "@/lib/cart";

const PRODUCT_IMAGES: Record<number, { main: string; hover: string }> = {
  // Men Clothing
  1:  { main: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=75",  hover: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=75"  },
  2:  { main: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=75", hover: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=75" },
  3:  { main: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=75",  hover: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&q=75"  },
  4:  { main: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=75", hover: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=75" },
  5:  { main: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=75", hover: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=75" },
  6:  { main: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=75", hover: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=75" },
  7:  { main: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=75", hover: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=75" },
  8:  { main: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=75", hover: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=75" },
  // Men Footwear
  9:  { main: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=75", hover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75"  },
  10: { main: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=75", hover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75"  },
  11: { main: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=75", hover: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=75"  },
  12: { main: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=75", hover: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=75" },
  13: { main: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=75", hover: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=75" },
  14: { main: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=75", hover: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=75"  },
  // Women Clothing
  15: { main: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=75", hover: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=75" },
  16: { main: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=75", hover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=75" },
  17: { main: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=75", hover: "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600&q=75" },
  18: { main: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=75", hover: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=75" },
  19: { main: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=75", hover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=75" },
  20: { main: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=75", hover: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=75" },
  21: { main: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=75", hover: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=75" },
  22: { main: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=75", hover: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=75" },
  // Women Footwear
  23: { main: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=75", hover: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=75"  },
  24: { main: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75",  hover: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=75"  },
  25: { main: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=75",  hover: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=75"  },
  26: { main: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=75",  hover: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=75"  },
  27: { main: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=75", hover: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=75"  },
  28: { main: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=75", hover: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=75" },
  // Teens Clothing
  29: { main: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=75",  hover: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=75"  },
  30: { main: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=75", hover: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=75" },
  31: { main: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=75", hover: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=75" },
  32: { main: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=75",  hover: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=75"  },
  33: { main: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=75", hover: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=75" },
  34: { main: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=75", hover: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=75" },
  // Teens Footwear
  35: { main: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=75", hover: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=75" },
  36: { main: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=75", hover: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=75" },
  37: { main: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=75", hover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75"  },
  38: { main: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=75",  hover: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=75"  },
  // Kids Clothing
  39: { main: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=75", hover: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=75" },
  40: { main: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=75", hover: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=75" },
  41: { main: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=75",  hover: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=75"  },
  42: { main: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=75", hover: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=75"  },
  43: { main: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=75", hover: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=75" },
  44: { main: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&q=75",  hover: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=75"  },
  // Kids Footwear
  45: { main: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75",  hover: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=75"  },
  46: { main: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=75", hover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=75"  },
  47: { main: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=75",  hover: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=75"  },
  48: { main: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=75", hover: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=75"  },
};

const COLOR_HEX: Record<string, string> = {
  Black: "#1a1a1a", White: "#f5f5f5", Tan: "#B5906A",  Cream: "#F0E6D3",
  Navy:  "#1B2A4A", Olive: "#6B6B3A", Rust: "#A0522D", Grey:  "#9E9E9E",
  Pink:  "#F4A7B9", Yellow:"#F5D76E", Red:  "#C0392B", Blue:  "#3B82F6",
};

export { PRODUCT_IMAGES };

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [wished, setWished] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const imgs = PRODUCT_IMAGES[product.id] ?? {
    main:  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=75",
    hover: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=75",
  };

  const genderLabel: Record<string, string> = { men: "Men", women: "Women", teens: "Teens", kids: "Kids" };

  // Close size picker when clicking outside
  useEffect(() => {
    function onOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSizes(false);
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, []);

  function handleQuickAdd(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length === 1) {
      // Only one size — add directly
      add({ id: product.id, name: product.name, price: product.price, size: product.sizes[0], color: product.colors[0], bg: product.bg });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } else {
      setShowSizes((v) => !v);
    }
  }

  function handleSelectSize(e: React.MouseEvent | React.TouchEvent, size: string) {
    e.preventDefault();
    e.stopPropagation();
    add({ id: product.id, name: product.name, price: product.price, size, color: product.colors[0], bg: product.bg });
    setShowSizes(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer relative"
      ref={ref}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-stone-100">
          <Image
            src={imgs.main}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-cover object-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-[1.04]"
          />
          <Image
            src={imgs.hover}
            alt={`${product.name} — alternate view`}
            fill
            sizes="(max-width:768px) 50vw, 33vw"
            className="object-cover object-center opacity-0 scale-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
          />

          {product.tag && (
            <span className="absolute top-3 left-3 bg-obsidian text-linen-cream font-dm text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 z-10">
              {product.tag}
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 w-8 h-8 bg-white/85 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-amber-tan z-10"
          >
            <Heart size={13} className={wished ? "fill-obsidian text-obsidian" : "text-obsidian"} />
          </button>

          {/* Size picker popup */}
          <AnimatePresence>
            {showSizes && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-12 left-0 right-0 z-20 bg-obsidian border-t border-amber-tan/20 px-3 py-3"
              >
                <p className="font-dm text-[9px] text-linen-cream/40 uppercase tracking-widest mb-2">Select size</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => handleSelectSize(e, s)}
                      onTouchEnd={(e) => handleSelectSize(e, s)}
                      className="font-dm text-[10px] px-2.5 py-1.5 border border-white/15 text-linen-cream/70 hover:bg-amber-tan hover:text-obsidian hover:border-amber-tan transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Add button — visible on hover (desktop) and always on mobile */}
          <button
            onClick={handleQuickAdd}
            onTouchEnd={handleQuickAdd}
            aria-label="Quick add"
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-obsidian text-linen-cream font-dm text-[10px] tracking-[0.18em] uppercase py-3.5 z-10
              sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-300"
          >
            {added ? <span className="text-amber-tan">Added ✓</span> : <><Plus size={12} /> Quick Add</>}
          </button>
        </div>

        <div className="space-y-1">
          <span className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.18em]">
            {genderLabel[product.gender]} · {product.subtype}
          </span>
          <h3 className="font-dm text-sm font-medium text-charcoal group-hover:text-amber-tan transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
          <p className="font-dm text-sm text-charcoal/60">{formatNGN(product.price)}</p>
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c} title={c} className="w-3 h-3 rounded-full border border-obsidian/15"
                style={{ backgroundColor: COLOR_HEX[c] ?? "#ccc" }} />
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
