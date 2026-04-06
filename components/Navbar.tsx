"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, ArrowRight, User } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "@/components/SearchModal";

function CartIcon() {
  const { count } = useCart();
  return (
    <Link href="/cart" aria-label="Cart" className="relative text-linen-cream/70 hover:text-amber-tan transition-colors duration-200">
      <ShoppingBag size={19} />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-amber-tan text-obsidian text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
          {count > 99 ? "99" : count}
        </span>
      )}
    </Link>
  );
}

const megaMenus = {
  Men: {
    Clothing: ["T-Shirts", "Shirts", "Trousers", "Jackets", "Hoodies"],
    Footwear: ["Sneakers", "Boots", "Loafers", "Sandals", "Formal"],
    rack: [
      { src: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&q=80", label: "Trench Coat" },
      { src: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=300&q=80", label: "Chelsea Boots" },
      { src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&q=80", label: "Linen Shirt" },
      { src: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&q=80", label: "Sneakers" },
    ],
  },
  Women: {
    Clothing: ["Tops", "Dresses", "Trousers", "Blazers", "Knitwear"],
    Footwear: ["Heels", "Sneakers", "Boots", "Flats", "Mules"],
    rack: [
      { src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80", label: "Wrap Dress" },
      { src: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=300&q=80", label: "Heeled Mules" },
      { src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300&q=80", label: "Blazer" },
      { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80", label: "Sneakers" },
    ],
  },
  Teens: {
    Clothing: ["T-Shirts", "Hoodies", "Joggers", "Dresses", "Jackets"],
    Footwear: ["Sneakers", "Boots", "Slides", "Sandals"],
    rack: [
      { src: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80", label: "Hoodie" },
      { src: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&q=80", label: "Sneakers" },
      { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80", label: "Graphic Tee" },
      { src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&q=80", label: "Boots" },
    ],
  },
  Kids: {
    Clothing: ["T-Shirts", "Sets", "Hoodies", "Shorts", "Dresses"],
    Footwear: ["Sneakers", "Sandals", "Boots", "Slippers"],
    rack: [
      { src: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300&q=80", label: "Kids Tee" },
      { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80", label: "Sneakers" },
      { src: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=300&q=80", label: "Hoodie" },
      { src: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80", label: "Sandals" },
    ],
  },
};

type CatKey = keyof typeof megaMenus;

function ProductRack({ items }: { items: { src: string; label: string }[] }) {
  const transforms = [
    { rotate: "-8deg", translateX: "-18px", translateY: "6px",  z: 0  },
    { rotate: "-3deg", translateX: "-6px",  translateY: "2px",  z: 10 },
    { rotate:  "3deg", translateX:  "6px",  translateY: "2px",  z: 20 },
    { rotate:  "9deg", translateX:  "20px", translateY: "8px",  z: 10 },
  ];
  return (
    <div className="relative flex items-end justify-center h-56" style={{ perspective: "600px" }}>
      {items.map((item, i) => (
        <motion.div key={item.label}
          initial={{ opacity: 0, y: 20, rotateY: -15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-28 shadow-2xl rounded-sm overflow-hidden"
          style={{ transform: `rotate(${transforms[i].rotate}) translateX(${transforms[i].translateX}) translateY(${transforms[i].translateY})`, zIndex: transforms[i].z, transformOrigin: "bottom center" }}
        >
          <div className="relative aspect-[3/4]">
            <Image src={item.src} alt={item.label} fill sizes="112px" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-obsidian/30" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-obsidian/80 to-transparent">
            <p className="font-dm text-[9px] text-linen-cream/80 truncate">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState<CatKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-obsidian shadow-lg shadow-black/40" : "bg-obsidian"
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="font-playfair text-[1.6rem] font-bold text-amber-tan shrink-0" style={{ letterSpacing: "-1px" }}>
            VOXE
          </Link>

          {/* Desktop nav pill — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-1 font-dm text-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1.5">
            {(["Men", "Women", "Teens", "Kids"] as CatKey[]).map((cat) => (
              <li key={cat} className="relative" onMouseEnter={() => setOpen(cat)} onMouseLeave={() => setOpen(null)}>
                <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  open === cat ? "bg-amber-tan text-obsidian" : "text-linen-cream/75 hover:bg-white/10 hover:text-linen-cream"
                }`}>
                  {cat}
                  <ChevronDown size={11} className={`transition-transform duration-200 ${open === cat ? "rotate-180" : ""}`} />
                </button>
              </li>
            ))}
            <li className="w-px h-4 bg-white/10 mx-1" />
            {[
              { label: "Shop All",     href: "/shop"           },
              { label: "New Arrivals", href: "/shop?sort=newest"},
              { label: "Lookbook",     href: "/lookbook"       },
              { label: "About",        href: "/about"          },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="block px-4 py-2 rounded-full text-[13px] font-medium text-linen-cream/75 hover:bg-white/10 hover:text-linen-cream transition-all duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search — hidden on mobile */}
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="hidden sm:block text-linen-cream/70 hover:text-amber-tan transition-colors duration-200">
              <Search size={19} />
            </button>
            {/* Wishlist — hidden on mobile */}
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden sm:block text-linen-cream/70 hover:text-amber-tan transition-colors duration-200">
              <Heart size={19} />
              {wishCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-tan text-obsidian text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
                  {wishCount}
                </span>
              )}
            </Link>
            {/* Profile icon */}
            <Link href="/auth" aria-label="Account" className="text-linen-cream/70 hover:text-amber-tan transition-colors duration-200">
              <User size={19} />
            </Link>
            {/* Cart — always visible */}
            <CartIcon />
            {/* Hamburger — mobile only */}
            <button className="md:hidden text-linen-cream/70 hover:text-amber-tan transition-colors duration-200"
              onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </nav>

        {/* Mega menu */}
        <AnimatePresence>
          {open && (
            <motion.div key={open}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => setOpen(open)} onMouseLeave={() => setOpen(null)}
              className="absolute left-0 right-0 top-full bg-obsidian border-t border-amber-tan/10 shadow-2xl shadow-black/40"
            >
              <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-[1fr_1fr_1fr_auto] gap-10 items-start">
                <div>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.25em] mb-4 font-semibold">Clothing</p>
                  <ul className="space-y-2.5">
                    {megaMenus[open].Clothing.map((item) => (
                      <li key={item}>
                        <Link href={`/shop/${open.toLowerCase()}/clothing?subtypes=${encodeURIComponent(item)}`} onClick={() => setOpen(null)}
                          className="font-dm text-sm text-linen-cream/55 hover:text-linen-cream hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 group">
                          <span className="w-0 group-hover:w-3 h-px bg-amber-tan transition-all duration-200 overflow-hidden" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.25em] mb-4 font-semibold">Footwear</p>
                  <ul className="space-y-2.5">
                    {megaMenus[open].Footwear.map((item) => (
                      <li key={item}>
                        <Link href={`/shop/${open.toLowerCase()}/footwear?subtypes=${encodeURIComponent(item)}`} onClick={() => setOpen(null)}
                          className="font-dm text-sm text-linen-cream/55 hover:text-linen-cream hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-2 group">
                          <span className="w-0 group-hover:w-3 h-px bg-amber-tan transition-all duration-200 overflow-hidden" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-between h-full pt-1">
                  <div>
                    <p className="font-playfair text-2xl text-linen-cream mb-1">{open}</p>
                    <p className="font-dm text-xs text-linen-cream/35 mb-5">Explore the full {open.toLowerCase()} collection</p>
                    <Link href={`/shop/${open.toLowerCase()}`} onClick={() => setOpen(null)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.15em] uppercase hover:bg-linen-cream transition-colors duration-200 rounded-sm">
                      Shop All {open} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
                <div className="w-64 flex flex-col items-center">
                  <p className="font-dm text-[9px] text-linen-cream/25 uppercase tracking-[0.25em] mb-4">Featured Picks</p>
                  <ProductRack items={megaMenus[open].rack} />
                </div>
              </div>
              <div className="border-t border-white/6 px-6 py-3 max-w-7xl mx-auto flex items-center gap-6">
                <span className="font-dm text-[10px] text-linen-cream/25 uppercase tracking-widest">Quick links</span>
                {["New Arrivals", "Bestsellers", "Sale"].map((l) => (
                  <Link key={l} href="/shop" onClick={() => setOpen(null)} className="font-dm text-[11px] text-linen-cream/40 hover:text-amber-tan transition-colors">{l}</Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer — full menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[300px] bg-obsidian overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-[68px] border-b border-amber-tan/10">
                <span className="font-playfair text-xl font-bold text-amber-tan" style={{ letterSpacing: "-1px" }}>VOXE</span>
                <div className="flex items-center gap-4">
                  <Link href="/cart" onClick={() => setMobileOpen(false)} className="relative text-linen-cream/60 hover:text-amber-tan transition-colors">
                    <ShoppingBag size={19} />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-tan text-obsidian text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
                        {count > 99 ? "99" : count}
                      </span>
                    )}
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="text-linen-cream/60 hover:text-amber-tan transition-colors">
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6 space-y-5 font-dm text-sm">
                {/* Main links */}
                <div className="space-y-1">
                  {[
                    { label: "Shop All",     href: "/shop"            },
                    { label: "New Arrivals", href: "/shop?sort=newest" },
                    { label: "Lookbook",     href: "/lookbook"        },
                    { label: "About",        href: "/about"           },
                  ].map(({ label, href }) => (
                    <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3 border-b border-amber-tan/8 text-linen-cream/80 hover:text-amber-tan transition-colors">
                      {label}
                      <ArrowRight size={13} className="text-linen-cream/20" />
                    </Link>
                  ))}
                </div>

                {/* Categories */}
                <div className="space-y-4 pt-2">
                  {(["Men", "Women", "Teens", "Kids"] as CatKey[]).map((cat) => (
                    <div key={cat}>
                      <Link href={`/shop/${cat.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between mb-2">
                        <span className="text-amber-tan font-semibold uppercase tracking-[0.15em] text-xs">{cat}</span>
                        <ArrowRight size={11} className="text-amber-tan/40" />
                      </Link>
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 ml-1">
                        {[...megaMenus[cat].Clothing.slice(0, 3), ...megaMenus[cat].Footwear.slice(0, 2)].map((item) => (
                          <Link key={item} href={`/shop/${cat.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                            className="text-linen-cream/40 hover:text-linen-cream text-xs transition-colors">
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Account + utility links */}
                <div className="border-t border-amber-tan/10 pt-5 space-y-3">
                  <Link href="/auth" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 text-linen-cream/70 hover:text-amber-tan transition-colors">
                    <User size={15} /> Sign In / Create Account
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 text-linen-cream/70 hover:text-amber-tan transition-colors">
                    <Heart size={15} /> Wishlist {wishCount > 0 && <span className="ml-auto text-amber-tan text-xs">{wishCount}</span>}
                  </Link>
                  <Link href="/size-guide" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 text-linen-cream/70 hover:text-amber-tan transition-colors">
                    Size Guide
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
