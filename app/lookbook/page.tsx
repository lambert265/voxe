"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { hidden, visibleFadeUp } from "@/lib/motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FILTERS = [
  "All",
  "SS25 Collection",
  "Streetwear Edit",
  "Formal Series",
  "Women's Lookbook",
  "Men's Lookbook",
];

type Tag = { label: string; href: string };
type Entry = {
  id: number;
  image: string;
  collection: string;
  date: string;
  tags: Tag[];
};

const ENTRIES: Entry[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "SS25 Collection",
    date: "March 2025",
    tags: [
      { label: "Linen Relaxed Shirt ₦32,000", href: "/product/2" },
      { label: "Wide-Leg Cargo Trousers ₦41,000", href: "/product/4" },
    ],
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Women's Lookbook",
    date: "February 2025",
    tags: [
      { label: "Silk Wrap Dress ₦61,500", href: "/product/15" },
      { label: "Strappy Heeled Mules ₦51,500", href: "/product/23" },
    ],
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Men's Lookbook",
    date: "March 2025",
    tags: [
      { label: "Structured Blazer ₦76,000", href: "/product/6" },
      { label: "Slim Chino Trousers ₦29,500", href: "/product/7" },
      { label: "Leather Derby Shoes ₦54,000", href: "/product/11" },
    ],
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Streetwear Edit",
    date: "January 2025",
    tags: [
      { label: "Heavyweight Hoodie ₦47,500", href: "/product/3" },
      { label: "Wide-Leg Cargo Trousers ₦41,000", href: "/product/4" },
    ],
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Women's Lookbook",
    date: "March 2025",
    tags: [
      { label: "Oversized Blazer ₦72,000", href: "/product/17" },
      { label: "Wide-Leg Linen Trousers ₦39,500", href: "/product/19" },
      { label: "Pointed Toe Flats ₦28,000", href: "/product/26" },
    ],
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Formal Series",
    date: "February 2025",
    tags: [
      { label: "Obsidian Trench Coat ₦89,500", href: "/product/1" },
      { label: "Slip-On Loafers ₦38,500", href: "/product/12" },
    ],
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Streetwear Edit",
    date: "January 2025",
    tags: [
      { label: "Washed Graphic Tee ₦18,500", href: "/product/5" },
      { label: "Low-Top Canvas Sneakers ₦29,500", href: "/product/10" },
    ],
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "SS25 Collection",
    date: "March 2025",
    tags: [
      { label: "Linen Co-ord Set ₦55,000", href: "/product/16" },
      { label: "Cream Leather Sneakers ₦54,000", href: "/product/24" },
    ],
  },
  {
    id: 9,
    image: "https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=800",
    collection: "Formal Series",
    date: "February 2025",
    tags: [
      { label: "Structured Blazer ₦76,000", href: "/product/6" },
      { label: "Ribbed Knit Polo ₦24,000", href: "/product/8" },
      { label: "Suede Chelsea Boots ₦68,000", href: "/product/9" },
    ],
  },
];

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

function LookbookCard({ entry, index }: { entry: Entry; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariant}
      className="relative group break-inside-avoid mb-4 overflow-hidden"
    >
      {/* Image */}
      <Image
        src={entry.image}
        alt={entry.collection}
        width={800}
        height={1100}
        className="w-full h-auto block"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Always-visible collection tag */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <span className="font-dm text-[9px] tracking-[0.2em] uppercase text-linen-cream bg-amber-tan/75 backdrop-blur-sm px-2.5 py-1">
          {entry.collection}
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/55 transition-colors duration-350 pointer-events-none group-hover:pointer-events-auto">
        {/* Top: title + date */}
        <div className="absolute top-5 left-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <h3 className="font-dm text-linen-cream text-2xl leading-tight mb-1.5">
            {entry.collection}
          </h3>
          <p className="font-dm text-linen-cream/55 text-[11px] tracking-[0.25em] uppercase">
            {entry.date}
          </p>
        </div>

        {/* Bottom: shoppable tags */}
        <div className="absolute bottom-12 left-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Link
              key={tag.href}
              href={tag.href}
              className="font-dm text-[10px] tracking-wide text-obsidian bg-amber-tan hover:bg-linen-cream transition-colors duration-200 px-2.5 py-1 whitespace-nowrap pointer-events-auto"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function LookbookPage() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? ENTRIES : ENTRIES.filter((e) => e.collection === active);

  return (
    <>
      <Navbar />
      <main className="bg-obsidian min-h-screen pt-[68px]">
        {/* Header */}
        <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 py-20">
          <motion.p
            initial={hidden}
            animate={visibleFadeUp(0)}
            className="font-dm text-amber-tan text-[10px] tracking-[0.45em] uppercase mb-5"
          >
            VOXE Editorial
          </motion.p>
          <motion.h1
            initial={hidden}
            animate={visibleFadeUp(0.08)}
            className="font-dm text-[clamp(3.5rem,9vw,7rem)] text-linen-cream leading-none mb-5"
          >
            The Edit
          </motion.h1>
          <motion.p
            initial={hidden}
            animate={visibleFadeUp(0.16)}
            className="font-dm text-linen-cream/45 text-base md:text-lg mb-12 max-w-md"
          >
            Our seasonal collections, styled for you.
          </motion.p>

          {/* Filter pills */}
          <motion.div
            initial={hidden}
            animate={visibleFadeUp(0.24)}
            className="flex flex-wrap justify-center gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`font-dm text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-colors duration-200 ${
                  active === f
                    ? "bg-amber-tan text-obsidian border-amber-tan"
                    : "bg-transparent text-amber-tan border-amber-tan/40 hover:border-amber-tan hover:text-amber-tan"
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Masonry grid */}
        <section className="px-4 md:px-8 lg:px-12 pt-10 pb-28">
          <AnimatePresence mode="wait">
            <div
              key={active}
              className="columns-1 sm:columns-2 lg:columns-3 gap-4"
            >
              {filtered.map((entry, i) => (
                <LookbookCard key={entry.id} entry={entry} index={i} />
              ))}
            </div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center font-dm text-linen-cream/30 text-sm py-24">
              No entries in this collection yet.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
