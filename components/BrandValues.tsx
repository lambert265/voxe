"use client";
import { Award, Users, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { hidden, visibleFadeUp } from "@/lib/motion";

const values = [
  { icon: Award, title: "Uncompromising Quality",  desc: "Every piece is crafted from sustainably sourced materials built to last seasons, not trends." },
  { icon: Users, title: "Radically Inclusive",      desc: "Fashion for every body, every gender, every story. No exceptions, no asterisks." },
  { icon: Truck, title: "Fast Delivery",            desc: "Reliable shipping on every order. Returns made simple, always." },
];

export default function BrandValues() {
  return (
    <section className="py-24 md:py-28 px-6 bg-obsidian border-t border-amber-tan/10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {values.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={hidden}
            whileInView={visibleFadeUp(i * 0.12)}
            viewport={{ once: true, margin: "-60px" }}
            className="card-gloss rounded-xl p-8 flex flex-col items-center text-center group hover:border-amber-tan/25 transition-colors duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-amber-tan/10 border border-amber-tan/25 flex items-center justify-center mb-6 group-hover:bg-amber-tan/20 transition-colors duration-300 shadow-amber-glow">
              <Icon size={22} className="text-amber-tan" />
            </div>
            <h3 className="font-dm text-xl text-linen-cream mb-3">{title}</h3>
            <p className="font-dm text-sm text-linen-cream/40 leading-relaxed max-w-xs">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
