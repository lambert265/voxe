"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { hidden, visibleFadeUp } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

const categories = ["Men", "Women", "Teens", "Kids"];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-obsidian flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
          alt="VOXE hero" fill priority
          className="object-cover object-center opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/90 via-obsidian/40 to-obsidian/95" />
      </div>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-48 bg-gradient-to-b from-transparent via-amber-tan to-transparent origin-center"
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div initial={hidden} animate={visibleFadeUp(0)} className="flex justify-center mb-8">
          <span className="glass-dark inline-flex items-center gap-2 px-4 py-2 rounded-full font-dm text-[10px] tracking-[0.35em] uppercase text-amber-tan">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-tan animate-pulse-amber" />
            New Season — SS 2025
          </span>
        </motion.div>

        <motion.h1
          initial={hidden} animate={visibleFadeUp(0.1)}
          className="font-dm text-[clamp(3.5rem,10vw,8rem)] text-linen-cream leading-[0.9] mb-8 tracking-tight"
        >
          Wear your<br />
          <em className="not-italic bg-amber-gradient bg-clip-text text-transparent">story.</em>
        </motion.h1>

        <motion.p
          initial={hidden} animate={visibleFadeUp(0.2)}
          className="font-dm text-linen-cream/45 text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed"
        >
          Fashion without boundaries. Clothing and footwear designed for every body, every identity, every moment.
        </motion.p>

        <motion.div initial={hidden} animate={visibleFadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link href="/shop/men"
            className="btn-amber sheen inline-flex items-center justify-center gap-2 px-10 py-4 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
            Shop Men <ArrowRight size={13} />
          </Link>
          <Link href="/shop/women"
            className="glass-dark sheen inline-flex items-center justify-center gap-2 px-10 py-4 text-linen-cream font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm hover:border-amber-tan/40 transition-colors duration-300">
            Shop Women <ArrowRight size={13} />
          </Link>
        </motion.div>

        <motion.div initial={hidden} animate={visibleFadeUp(0.4)} className="flex items-center justify-center gap-3 flex-wrap">
          {categories.map((cat) => (
            <Link key={cat} href={`/shop/${cat.toLowerCase()}`}
              className="glass-dark px-5 py-2 rounded-full font-dm text-xs text-linen-cream/55 hover:text-amber-tan hover:border-amber-tan/30 transition-all duration-200">
              {cat}
            </Link>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-dm text-linen-cream/20 text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-amber-tan/50 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
