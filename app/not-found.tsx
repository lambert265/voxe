"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-off-white flex flex-col items-center justify-center text-center px-6 pt-[68px] overflow-hidden">

        {/* Hanger + clothes illustration */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10 select-none"
        >
          <svg
            viewBox="0 0 420 320"
            className="w-[320px] md:w-[420px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hanging rod */}
            <rect x="20" y="48" width="380" height="6" rx="3" fill="#2A2A2A" opacity="0.12" />

            {/* Hanger hook */}
            <path d="M210 48 Q210 18 228 12 Q246 6 246 18 Q246 26 238 28" stroke="#2A2A2A" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.5" />

            {/* ── Garment 1 — Trench coat (left, slight tilt) ── */}
            <g transform="rotate(-6, 120, 51)">
              {/* hanger */}
              <path d="M120 51 L80 80 L160 80" stroke="#B5906A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="120" y1="48" x2="120" y2="51" stroke="#B5906A" strokeWidth="2.5" strokeLinecap="round" />
              {/* coat body */}
              <path d="M80 80 L68 200 Q68 210 78 210 L162 210 Q172 210 172 200 L160 80 Z" fill="#2A2A2A" opacity="0.88" />
              {/* lapels */}
              <path d="M80 80 L100 130 L120 110 L140 130 L160 80" fill="#1a1a1a" opacity="0.9" />
              {/* belt */}
              <rect x="75" y="158" width="90" height="8" rx="2" fill="#B5906A" opacity="0.7" />
              {/* buttons */}
              <circle cx="120" cy="140" r="2.5" fill="#B5906A" opacity="0.8" />
              <circle cx="120" cy="155" r="2.5" fill="#B5906A" opacity="0.8" />
              {/* sleeves */}
              <path d="M80 80 L52 150 Q48 162 58 164 L72 160 L80 100" fill="#2A2A2A" opacity="0.85" />
              <path d="M160 80 L188 150 Q192 162 182 164 L168 160 L160 100" fill="#2A2A2A" opacity="0.85" />
            </g>

            {/* ── Garment 2 — Dress (centre, straight) ── */}
            <g transform="translate(0, 0)">
              {/* hanger */}
              <path d="M210 51 L170 80 L250 80" stroke="#B5906A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="210" y1="48" x2="210" y2="51" stroke="#B5906A" strokeWidth="2.5" strokeLinecap="round" />
              {/* dress bodice */}
              <path d="M170 80 L162 140 L258 140 L250 80 Z" fill="#F0E6D3" opacity="0.95" />
              {/* dress skirt flare */}
              <path d="M162 140 L145 240 Q143 252 155 252 L265 252 Q277 252 275 240 L258 140 Z" fill="#F0E6D3" opacity="0.95" />
              {/* neckline detail */}
              <path d="M185 80 Q210 100 235 80" stroke="#B5906A" strokeWidth="1.5" fill="none" opacity="0.6" />
              {/* waist seam */}
              <line x1="162" y1="140" x2="258" y2="140" stroke="#B5906A" strokeWidth="1.5" opacity="0.4" />
              {/* skirt pleat lines */}
              <line x1="175" y1="145" x2="160" y2="248" stroke="#2A2A2A" strokeWidth="0.8" opacity="0.1" />
              <line x1="210" y1="145" x2="210" y2="250" stroke="#2A2A2A" strokeWidth="0.8" opacity="0.1" />
              <line x1="245" y1="145" x2="260" y2="248" stroke="#2A2A2A" strokeWidth="0.8" opacity="0.1" />
              {/* outline */}
              <path d="M170 80 L162 140 L145 240 Q143 252 155 252 L265 252 Q277 252 275 240 L258 140 L250 80 Z" stroke="#B5906A" strokeWidth="1" opacity="0.25" fill="none" />
            </g>

            {/* ── Garment 3 — Blazer (right, slight tilt) ── */}
            <g transform="rotate(6, 300, 51)">
              {/* hanger */}
              <path d="M300 51 L260 80 L340 80" stroke="#B5906A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="300" y1="48" x2="300" y2="51" stroke="#B5906A" strokeWidth="2.5" strokeLinecap="round" />
              {/* blazer body */}
              <path d="M260 80 L252 195 Q252 205 262 205 L338 205 Q348 205 348 195 L340 80 Z" fill="#B5906A" opacity="0.82" />
              {/* lapels */}
              <path d="M260 80 L278 125 L300 108 L322 125 L340 80" fill="#A07850" opacity="0.9" />
              {/* pocket */}
              <rect x="264" y="160" width="22" height="14" rx="2" fill="#A07850" opacity="0.5" />
              {/* buttons */}
              <circle cx="300" cy="148" r="3" fill="#F0E6D3" opacity="0.7" />
              <circle cx="300" cy="163" r="3" fill="#F0E6D3" opacity="0.7" />
              {/* sleeves */}
              <path d="M260 80 L234 148 Q230 160 240 162 L254 158 L262 100" fill="#B5906A" opacity="0.8" />
              <path d="M340 80 L366 148 Q370 160 360 162 L346 158 L338 100" fill="#B5906A" opacity="0.8" />
            </g>

            {/* ── Shoe pair below — left shoe ── */}
            <g transform="translate(60, 255)">
              <ellipse cx="38" cy="52" rx="38" ry="7" fill="#2A2A2A" opacity="0.07" />
              {/* sole */}
              <path d="M4 44 Q4 52 14 52 L62 52 Q72 52 72 44 L68 36 Q64 30 54 30 L18 30 Q8 30 4 36 Z" fill="#1a1a1a" opacity="0.9" />
              {/* upper */}
              <path d="M18 30 Q10 18 14 10 Q20 2 32 4 L58 8 Q68 12 68 22 L68 36 Q64 30 54 30 Z" fill="#2A2A2A" opacity="0.88" />
              {/* highlight */}
              <path d="M22 12 Q30 6 44 8 Q54 10 60 18" stroke="white" strokeWidth="1.5" opacity="0.12" strokeLinecap="round" fill="none" />
              {/* heel tab */}
              <rect x="60" y="28" width="8" height="16" rx="2" fill="#B5906A" opacity="0.7" />
            </g>

            {/* ── Shoe pair — right shoe (mirrored, slight offset) ── */}
            <g transform="translate(268, 262)">
              <ellipse cx="38" cy="46" rx="38" ry="7" fill="#2A2A2A" opacity="0.07" />
              <path d="M4 38 Q4 46 14 46 L62 46 Q72 46 72 38 L68 30 Q64 24 54 24 L18 24 Q8 24 4 30 Z" fill="#1a1a1a" opacity="0.9" />
              <path d="M18 24 Q10 12 14 4 Q20 -4 32 -2 L58 2 Q68 6 68 16 L68 30 Q64 24 54 24 Z" fill="#2A2A2A" opacity="0.88" />
              <path d="M22 6 Q30 0 44 2 Q54 4 60 12" stroke="white" strokeWidth="1.5" opacity="0.12" strokeLinecap="round" fill="none" />
              <rect x="60" y="22" width="8" height="16" rx="2" fill="#B5906A" opacity="0.7" />
            </g>

            {/* Shadow under everything */}
            <ellipse cx="210" cy="308" rx="160" ry="8" fill="#2A2A2A" opacity="0.06" />
          </svg>

          {/* Gentle sway animation on the whole rack */}
          <motion.div
            animate={{ rotate: [0, 1.2, 0, -1.2, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{ transformOrigin: "50% 0%" }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3 mb-10"
        >
          <p className="font-dm text-amber-tan text-[11px] tracking-[0.4em] uppercase">404</p>
          <h1 className="font-dm text-4xl md:text-5xl text-charcoal leading-tight">
            This page doesn&apos;t exist.
          </h1>
          <p className="font-dm text-charcoal/45 text-lg">
            Let&apos;s get you back to style.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/"
            className="px-10 py-4 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300">
            Go Home
          </Link>
          <Link href="/shop"
            className="px-10 py-4 border border-charcoal/20 text-charcoal font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:border-amber-tan hover:text-amber-tan transition-colors duration-300">
            Browse Shop
          </Link>
        </motion.div>

      </main>
      <Footer />
    </>
  );
}
