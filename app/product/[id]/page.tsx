"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ChevronDown, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { hidden, visibleFadeUp, staggerContainer, scaleInVariant } from "@/lib/motion";
import { triggerCartToast } from "@/components/CartToast";

const RECENTLY_VIEWED_KEY = "voxe_recently_viewed";

function useRecentlyViewed(currentId: number) {
  useEffect(() => {
    try {
      const stored: number[] = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
      const updated = [currentId, ...stored.filter((id) => id !== currentId)].slice(0, 5);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch {}
  }, [currentId]);

  try {
    const stored: number[] = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
    return stored.filter((id) => id !== currentId).slice(0, 4);
  } catch {
    return [];
  }
}

const PRODUCT_IMAGES: Record<number, string[]> = {
  // 1 — Obsidian Trench Coat (men, jacket)
  1:  ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80","https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80","https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=900&q=80"],
  // 2 — Linen Relaxed Shirt (men, shirt)
  2:  ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80","https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=900&q=80","https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=80"],
  // 3 — Heavyweight Hoodie (men, hoodie)
  3:  ["https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=900&q=80","https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=900&q=80","https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=900&q=80"],
  // 4 — Wide-Leg Cargo Trousers (men, trousers)
  4:  ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80","https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=900&q=80","https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80"],
  // 5 — Washed Graphic Tee (men, t-shirt)
  5:  ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80","https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80"],
  // 6 — Structured Blazer (men, jacket)
  6:  ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80","https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80","https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=900&q=80"],
  // 7 — Slim Chino Trousers (men, trousers)
  7:  ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80","https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=900&q=80"],
  // 8 — Ribbed Knit Polo (men, t-shirt/polo)
  8:  ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=900&q=80","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=80","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80"],
  // 9 — Suede Chelsea Boots (men, boots)
  9:  ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=900&q=80","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80","https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=80"],
  // 10 — Low-Top Canvas Sneakers (men, sneakers)
  10: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80","https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80"],
  // 11 — Leather Derby Shoes (men, formal)
  11: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=80","https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80","https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&q=80"],
  // 12 — Slip-On Loafers (men, loafers)
  12: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&q=80","https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=80","https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80"],
  // 13 — Chunky Sole Boots (men, boots)
  13: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=80","https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=900&q=80","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80"],
  // 14 — Leather Sandals (men, sandals)
  14: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=80","https://images.unsplash.com/photo-1562183241-b937e95585b6?w=900&q=80","https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=80"],
  // 15 — Silk Wrap Dress (women, dress)
  15: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80","https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80"],
  // 16 — Linen Co-ord Set (women, co-ords)
  16: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=900&q=80","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80"],
  // 17 — Oversized Blazer (women, blazer)
  17: ["https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&q=80","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80","https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=900&q=80"],
  // 18 — Ribbed Crop Top (women, top)
  18: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80","https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80"],
  // 19 — Wide-Leg Linen Trousers (women, trousers)
  19: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80","https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=900&q=80"],
  // 20 — Satin Slip Dress (women, dress)
  20: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80","https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80"],
  // 21 — Knit Cardigan (women, top/knitwear)
  21: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=80","https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80"],
  // 22 — Tailored Shorts Co-ord (women, co-ords)
  22: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80","https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=900&q=80","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80"],
  // 23 — Strappy Heeled Mules (women, mules/heels)
  23: ["https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=900&q=80","https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80","https://images.unsplash.com/photo-1562183241-b937e95585b6?w=900&q=80"],
  // 24 — Cream Leather Sneakers (women, sneakers)
  24: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80","https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80","https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80"],
  // 25 — Block Heel Boots (women, boots)
  25: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80","https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=80","https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=900&q=80"],
  // 26 — Pointed Toe Flats (women, flats)
  26: ["https://images.unsplash.com/photo-1562183241-b937e95585b6?w=900&q=80","https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=900&q=80","https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80"],
  // 27 — Kitten Heel Mules (women, mules)
  27: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=80","https://images.unsplash.com/photo-1562183241-b937e95585b6?w=900&q=80","https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=900&q=80"],
  // 28 — Ankle Strap Heels (women, heels)
  28: ["https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=900&q=80","https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=80","https://images.unsplash.com/photo-1562183241-b937e95585b6?w=900&q=80"],
};

const COLOR_HEX: Record<string, string> = {
  Black: "#1a1a1a", White: "#f5f5f5", Tan: "#B5906A", Cream: "#F0E6D3",
  Navy: "#1B2A4A", Olive: "#6B6B3A", Rust: "#A0522D", Grey: "#9E9E9E",
};

const ACCORDION_ITEMS = [
  { title: "Details & Composition", body: "Crafted from premium sustainably sourced materials. Each piece is cut and sewn to exacting standards for a refined, lasting fit." },
  { title: "Size & Fit", body: "This piece runs true to size. For an oversized look, size up one. Refer to our size guide for exact measurements." },
  { title: "Shipping & Returns", body: "Standard delivery 3–5 business days. Free returns within 30 days of receipt." },
  { title: "Care Instructions", body: "Dry clean or hand wash cold. Do not tumble dry. Iron on low heat. Store folded to preserve shape." },
];

function Accordion({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-obsidian/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-dm text-sm text-charcoal hover:text-amber-tan transition-colors"
      >
        {title}
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="font-dm text-sm text-charcoal/55 leading-relaxed pb-4">{body}</p>
      )}
    </div>
  );
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = ALL_PRODUCTS.find((p) => p.id === Number(id));
  if (!product) notFound();

  const images = PRODUCT_IMAGES[product.id] ?? [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
  ];

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const recentIds = useRecentlyViewed(product.id);
  const recentProducts = ALL_PRODUCTS.filter((p) => recentIds.includes(p.id))
    .sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));

  const related = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.gender === product.gender || p.type === product.type)
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    for (let i = 0; i < qty; i++) {
      add({ id: product.id, name: product.name, price: product.price, size: selectedSize, color: selectedColor, bg: product.bg });
    }
    triggerCartToast({ name: product.name, size: selectedSize, color: selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="bg-off-white pt-[68px] min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-5">
          <nav className="flex items-center gap-2 font-dm text-xs text-charcoal/40">
            <Link href="/" className="hover:text-amber-tan transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/shop/${product.gender}`} className="hover:text-amber-tan transition-colors capitalize">{product.gender}</Link>
            <span>/</span>
            <Link href={`/shop/${product.gender}/${product.type}`} className="hover:text-amber-tan transition-colors capitalize">{product.type}</Link>
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </nav>
        </div>

        {/* Product layout */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Image gallery */}
            <motion.div initial={hidden} animate={visibleFadeUp(0)} className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden sm:flex flex-col gap-3 w-20 flex-shrink-0">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-[3/4] overflow-hidden border-2 transition-colors ${activeImg === i ? "border-amber-tan" : "border-transparent hover:border-obsidian/20"}`}
                  >
                    <Image src={src} alt={`View ${i + 1}`} fill sizes="80px" className="object-cover object-center" />
                  </button>
                ))}
              </div>
              {/* Main image */}
              <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-stone-100">
                <Image
                  src={images[activeImg]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-obsidian text-linen-cream font-dm text-[9px] tracking-[0.18em] uppercase px-3 py-1.5">
                    {product.tag}
                  </span>
                )}
                {/* Mobile thumbnail dots */}
                <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${activeImg === i ? "bg-amber-tan" : "bg-white/60"}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product info */}
            <motion.div initial={hidden} animate={visibleFadeUp(0.1)} className="flex flex-col">
              <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.25em] mb-2">
                {({ men: "Men", women: "Women", teens: "Teens", kids: "Kids" } as Record<string,string>)[product.gender]} · {product.subtype}
              </p>
              <h1 className="font-dm text-3xl md:text-4xl text-obsidian mb-3 leading-tight">{product.name}</h1>
              <p className="font-dm text-2xl text-charcoal mb-8">{formatNGN(product.price)}</p>

              {/* Color */}
              <div className="mb-6">
                <p className="font-dm text-xs text-charcoal/50 uppercase tracking-widest mb-3">
                  Color — <span className="text-charcoal font-medium">{selectedColor}</span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-amber-tan scale-110 shadow-md" : "border-transparent hover:border-obsidian/30"}`}
                      style={{ backgroundColor: COLOR_HEX[c] ?? "#ccc" }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-dm text-xs text-charcoal/50 uppercase tracking-widest">Size</p>
                  <button className="font-dm text-xs text-amber-tan underline">
                    <Link href="/size-guide">Size Guide</Link>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`font-dm text-xs px-3.5 py-2 border transition-colors ${
                        selectedSize === s
                          ? "bg-obsidian border-obsidian text-linen-cream"
                          : "border-obsidian/20 text-charcoal/70 hover:border-amber-tan hover:text-amber-tan"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="font-dm text-xs text-charcoal/35 mt-2">Please select a size</p>
                )}
              </div>

              {/* Qty + Add to cart */}
              <div className="flex gap-3 mb-5">
                <div className="flex items-center border border-obsidian/20">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center hover:text-amber-tan transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-dm text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-12 flex items-center justify-center hover:text-amber-tan transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`flex-1 font-dm text-[11px] tracking-[0.2em] uppercase py-4 transition-colors duration-300 ${
                    added
                      ? "bg-amber-tan text-obsidian"
                      : selectedSize
                      ? "bg-obsidian text-linen-cream hover:bg-amber-tan hover:text-obsidian"
                      : "bg-obsidian/30 text-linen-cream/40 cursor-not-allowed"
                  }`}
                >
                  {added ? "Added to Cart ✓" : "Add to Cart"}
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  aria-label="Wishlist"
                  className="w-12 h-12 border border-obsidian/20 flex items-center justify-center hover:border-amber-tan hover:text-amber-tan transition-colors"
                >
                  <Heart size={16} className={has(product.id) ? "fill-amber-tan text-amber-tan" : ""} />
                </button>
              </div>

              {/* Link to lookbook */}
              <Link href="/lookbook" className="font-dm text-xs text-amber-tan hover:text-charcoal transition-colors mb-8 inline-flex items-center gap-1.5">
                <ArrowLeft size={12} /> See this styled in the Lookbook
              </Link>

              {/* Accordion */}
              <div className="border-t border-obsidian/10">
                {ACCORDION_ITEMS.map((item) => (
                  <Accordion key={item.title} {...item} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          <div className="mt-24">
            <motion.div
              initial={hidden}
              whileInView={visibleFadeUp(0)}
              viewport={{ once: true, margin: "-60px" }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <p className="font-dm text-amber-tan text-[10px] tracking-[0.35em] uppercase mb-1">You May Also Like</p>
                <h2 className="font-dm text-3xl md:text-4xl text-obsidian">Related Pieces</h2>
              </div>
              <Link href={`/shop/${product.gender}`} className="hidden sm:block font-dm text-xs text-charcoal border-b border-charcoal/30 pb-0.5 hover:text-amber-tan hover:border-amber-tan transition-colors">
                View All
              </Link>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {related.map((p) => {
                const imgs = PRODUCT_IMAGES[p.id];
                return (
                  <motion.article key={p.id} variants={scaleInVariant} className="group cursor-pointer">
                    <Link href={`/product/${p.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-stone-100">
                        <Image
                          src={imgs?.[0] ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=75"}
                          alt={p.name}
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                      <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.18em] mb-1">{p.subtype}</p>
                      <h3 className="font-dm text-sm font-medium text-charcoal group-hover:text-amber-tan transition-colors duration-200">{p.name}</h3>
                      <p className="font-dm text-sm text-charcoal/60 mt-0.5">{formatNGN(p.price)}</p>
                    </Link>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
          {/* Recently Viewed */}
          {recentProducts.length > 0 && (
            <div className="mt-20">
              <motion.div initial={hidden} whileInView={visibleFadeUp(0)} viewport={{ once: true, margin: "-60px" }} className="mb-10">
                <p className="font-dm text-amber-tan text-[10px] tracking-[0.35em] uppercase mb-1">Your History</p>
                <h2 className="font-dm text-3xl md:text-4xl text-obsidian">Recently Viewed</h2>
              </motion.div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {recentProducts.map((p) => {
                  const imgs = PRODUCT_IMAGES[p.id];
                  return (
                    <motion.article key={p.id} variants={scaleInVariant} className="group cursor-pointer">
                      <Link href={`/product/${p.id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-stone-100">
                          <Image src={imgs?.[0] ?? ""} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]" />
                        </div>
                        <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.18em] mb-1">{p.subtype}</p>
                        <h3 className="font-dm text-sm font-medium text-charcoal group-hover:text-amber-tan transition-colors duration-200">{p.name}</h3>
                        <p className="font-dm text-sm text-charcoal/60 mt-0.5">{formatNGN(p.price)}</p>
                      </Link>
                    </motion.article>
                  );
                })}
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
