"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { hidden, visibleFadeUp } from "@/lib/motion";
import { Mail, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-24 md:py-32 px-6 bg-obsidian border-t border-amber-tan/10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-tan/5 blur-[100px] rounded-full pointer-events-none" />
      <motion.div initial={hidden} whileInView={visibleFadeUp(0)} viewport={{ once: true, margin: "-80px" }}
        className="relative max-w-2xl mx-auto">
        <div className="card-gloss rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-tan/20 to-transparent" />
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-tan/15 border border-amber-tan/30 flex items-center justify-center shadow-amber-glow">
              <Mail size={20} className="text-amber-tan" />
            </div>
          </div>
          <p className="font-dm text-amber-tan text-[10px] tracking-[0.4em] uppercase mb-4">Join the Circle</p>
          <h2 className="font-dm text-4xl md:text-5xl text-linen-cream mb-4 leading-tight">
            Get 10% off your<br />
            <em className="not-italic bg-amber-gradient bg-clip-text text-transparent">first order.</em>
          </h2>
          <p className="font-dm text-linen-cream/35 text-base mb-10 leading-relaxed">
            Subscribe for early access to new drops, exclusive offers, and style notes from the VOXE edit.
          </p>
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4 flex flex-col items-center gap-2">
              <Sparkles size={24} className="text-amber-tan" />
              <p className="font-dm text-2xl text-linen-cream italic">Welcome to VOXE.</p>
              <p className="font-dm text-sm text-linen-cream/40 mt-1">Check your inbox for your 10% discount code.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" className="input-gold flex-1 px-5 py-4 rounded-sm font-dm text-sm" />
              <button type="submit" className="btn-amber sheen px-8 py-4 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
          <p className="font-dm text-[10px] text-linen-cream/20 mt-5">No spam. Unsubscribe anytime.</p>
        </div>
      </motion.div>
    </section>
  );
}
