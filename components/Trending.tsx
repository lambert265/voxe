"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { hidden, visibleFadeUp, visibleX } from "@/lib/motion";
import { TrendingUp } from "lucide-react";

const trending = [
  { id: 5,  name: "Washed Graphic Tee",  img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75" },
  { id: 12, name: "Tan Slip-On Loafers", img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=75" },
  { id: 4,  name: "Cargo Trousers",      img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=75" },
  { id: 10, name: "Canvas Sneakers",     img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=75" },
  { id: 21, name: "Knit Cardigan",       img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=75" },
  { id: 28, name: "Ankle Strap Heels",   img: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=75" },
  { id: 6,  name: "Structured Blazer",   img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=75" },
];

export default function Trending() {
  return (
    <section className="py-24 md:py-32 bg-obsidian-2 border-t border-amber-tan/10 overflow-hidden">
      <motion.div initial={hidden} whileInView={visibleFadeUp(0)} viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
        <div>
          <p className="font-dm text-amber-tan text-[10px] tracking-[0.35em] uppercase mb-2">What&apos;s Hot</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-linen-cream">Trending Now</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 glass-dark px-4 py-2 rounded-full">
          <TrendingUp size={13} className="text-amber-tan" />
          <span className="font-dm text-[10px] text-linen-cream/40 tracking-widest uppercase">Live</span>
        </div>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
        {trending.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, x: 40 }} whileInView={visibleX(i * 0.06)} viewport={{ once: true }}
            className="group flex-none w-48 cursor-pointer">
            <Link href={`/product/${item.id}`}>
              <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-charcoal rounded-sm border border-amber-tan/10">
                <Image src={item.img} alt={item.name} fill sizes="192px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-amber-tan flex items-center justify-center">
                  <span className="font-dm text-[10px] font-bold text-obsidian">{i + 1}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-dm text-xs font-medium text-linen-cream leading-snug">{item.name}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
