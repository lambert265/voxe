"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { hidden, hiddenScale, visibleFadeUp, visibleScale } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export default function FeaturedCollection() {
  return (
    <section className="bg-obsidian-2 py-24 md:py-32 px-6 overflow-hidden border-t border-amber-tan/10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div initial={hidden} whileInView={visibleFadeUp(0)} viewport={{ once: true, margin: "-80px" }}>
          <span className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full font-dm text-[10px] tracking-[0.35em] uppercase text-amber-tan mb-7">
            <span className="w-1 h-1 rounded-full bg-amber-tan" />
            Featured Collection
          </span>
          <h2 className="font-dm text-5xl md:text-6xl lg:text-7xl text-linen-cream leading-[0.93] mb-7">
            The Dark<br />
            <em className="not-italic bg-amber-gradient bg-clip-text text-transparent">Meridian</em><br />
            Edit
          </h2>
          <p className="font-dm text-linen-cream/40 text-base leading-relaxed max-w-md mb-10">
            A curated capsule of structured silhouettes, rich textures, and monochromatic depth. Designed for those who move through the world with intention.
          </p>
          <Link href="/shop"
            className="btn-amber sheen inline-flex items-center gap-3 px-10 py-4 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
            Explore Collection <ArrowRight size={13} />
          </Link>
        </motion.div>

        <motion.div initial={hiddenScale} whileInView={visibleScale(0.1)} viewport={{ once: true, margin: "-80px" }} className="relative">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-amber-tan/10">
              <Image src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=75"
                alt="Dark Meridian look 1" fill sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-amber-tan/10 mt-10">
              <Image src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=75"
                alt="Dark Meridian look 2" fill sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-amber-tan/20 rounded-sm pointer-events-none" />
          <div className="absolute -top-4 -left-4 w-14 h-14 border border-amber-tan/10 rounded-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-tan/6 blur-[60px] pointer-events-none rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
