"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { num: 500,   suffix: "+", label: "Products" },
  { num: 10000, suffix: "+", label: "Customers" },
  { num: 36,    suffix: "",  label: "States Delivered" },
  { num: 2,     suffix: "",  label: "Collections Per Year" },
];

const values = [
  { n: "01", name: "Quality",     desc: "Every piece is crafted with intention — premium materials, precise construction, and a commitment to lasting wear." },
  { n: "02", name: "Inclusivity", desc: "Fashion is for everyone. Our sizing, styling, and storytelling reflect the full spectrum of human identity." },
  { n: "03", name: "Community",   desc: "VOXE is more than a brand — it's a collective of people who believe in dressing with purpose and pride." },
];

const team = [
  { name: "Adaeze Okonkwo", role: "Creative Director", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80" },
  { name: "Emeka Nwosu",    role: "Head of Design",    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Zara Bello",     role: "Brand Strategist",  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1800 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-obsidian">

        {/* Hero */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.06)_0%,_transparent_70%)] pointer-events-none" />
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-5">
            Our Story
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="font-playfair text-[clamp(3rem,9vw,6rem)] text-linen-cream leading-none mb-6">
            We are VOXE
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="font-dm text-linen-cream/45 text-lg max-w-sm leading-relaxed">
            A fashion brand built for everyone. No conditions. No boundaries.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="w-px h-8 bg-gradient-to-b from-amber-tan/40 to-transparent" />
          </motion.div>
        </section>

        {/* Story */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
              <Image src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80"
                alt="VOXE editorial" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.3em] bg-obsidian/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  SS 2025 Collection
                </span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="space-y-6">
              <h2 className="font-playfair text-4xl md:text-5xl text-linen-cream">Our Story</h2>
              <p className="font-dm text-linen-cream/55 leading-relaxed">
                VOXE was born from a simple frustration — fashion that excluded more than it welcomed. We set out to build a brand where the clothes do the talking, not the labels.
              </p>
              <p className="font-dm text-linen-cream/55 leading-relaxed">
                From our first collection, we committed to cuts that flatter every body and fabrics that feel as good as they look. We started small — a studio, a handful of designs, and a belief that style should never come with conditions.
              </p>
              <p className="font-dm text-linen-cream/55 leading-relaxed">
                That belief grew into a community of thousands who wear VOXE not just as clothing, but as a statement of self.
              </p>
              <div className="w-12 h-px bg-amber-tan/40" />
              <p className="font-dm text-xs text-amber-tan uppercase tracking-[0.3em]">Lagos, Nigeria — Est. 2023</p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="space-y-2">
                <p className="font-playfair text-[48px] leading-none text-amber-tan">
                  <CountUp target={s.num} suffix={s.suffix} />
                </p>
                <p className="font-dm text-xs text-linen-cream/35 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-3">What We Stand For</p>
              <h2 className="font-playfair text-4xl text-linen-cream">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <motion.div key={v.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="card-gloss rounded-2xl p-8 border border-amber-tan/10 space-y-4">
                  <span className="font-playfair text-4xl text-amber-tan/30">{v.n}</span>
                  <h3 className="font-playfair text-2xl text-linen-cream">{v.name}</h3>
                  <p className="font-dm text-linen-cream/45 leading-relaxed text-sm">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-3">The People</p>
              <h2 className="font-playfair text-4xl text-linen-cream">Behind VOXE</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group text-center">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 border border-amber-tan/10">
                    <Image src={member.img} alt={member.name} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
                  </div>
                  <p className="font-dm text-sm font-semibold text-linen-cream">{member.name}</p>
                  <p className="font-dm text-xs text-amber-tan/60 mt-0.5">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.05)_0%,_transparent_70%)] pointer-events-none" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="font-playfair text-4xl md:text-5xl text-linen-cream mb-4">
            Ready to find your style?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="font-dm text-linen-cream/35 mb-10 text-base">
            Explore the full collection — clothing and footwear for everyone.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/men"
              className="btn-amber sheen px-10 py-4 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
              Shop Men
            </Link>
            <Link href="/shop/women"
              className="px-10 py-4 border border-amber-tan/30 text-amber-tan font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm hover:bg-amber-tan/10 transition-colors">
              Shop Women
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
