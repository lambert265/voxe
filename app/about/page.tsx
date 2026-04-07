"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hiddenX, visibleX, hidden, visibleFadeUp } from "@/lib/motion";

const stats = [
  { num: 500, suffix: "+", label: "Products" },
  { num: 10000, suffix: "+", label: "Customers" },
  { num: 3, suffix: "", label: "Cities Covered" },
  { num: 2, suffix: "", label: "Collections Per Year" },
];

const values = [
  { n: "01", name: "Quality", desc: "Every piece is crafted with intention — premium materials, precise construction, and a commitment to lasting wear." },
  { n: "02", name: "Inclusivity", desc: "Fashion is for everyone. Our sizing, styling, and storytelling reflect the full spectrum of human identity." },
  { n: "03", name: "Community", desc: "VOXE is more than a brand — it's a collective of people who believe in dressing with purpose and pride." },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Section 1 — Hero */}
      <section className="bg-obsidian min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={hidden}
          animate={visibleFadeUp(0.1)}
          className="font-dm text-[clamp(2.8rem,8vw,56px)] text-linen-cream mb-5"
        >
          We are VOXE
        </motion.h1>
        <motion.p
          initial={hidden}
          animate={visibleFadeUp(0.25)}
          className="font-dm text-[18px] text-linen-cream/50 max-w-sm"
        >
          A fashion brand built for everyone.
        </motion.p>
      </section>

      {/* Section 2 — Story */}
      <section className="bg-off-white py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80"
              alt="VOXE editorial"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <motion.div
            initial={hiddenX}
            whileInView={visibleX(0)}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            <h2 className="font-dm text-4xl md:text-5xl text-charcoal">Our Story</h2>
            <p className="font-dm text-charcoal/65 leading-relaxed">
              VOXE was born from a simple frustration — fashion that excluded more than it welcomed. We set out to build a brand where the clothes do the talking, not the labels. From our first collection, we committed to cuts that flatter every body and fabrics that feel as good as they look.
            </p>
            <p className="font-dm text-charcoal/65 leading-relaxed">
              We started small — a studio, a handful of designs, and a belief that style should never come with conditions. That belief grew into a community of thousands who wear VOXE not just as clothing, but as a statement of self.
            </p>
            <p className="font-dm text-charcoal/65 leading-relaxed">
              Today, VOXE spans two full collections a year, ships across three cities, and continues to grow — guided by the same principle we started with: fashion without boundaries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — Values */}
      <section className="bg-charcoal py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.n}
                initial={hidden}
                whileInView={visibleFadeUp(i * 0.12)}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-obsidian p-10 space-y-4"
              >
                <span className="font-dm text-4xl text-amber-tan">{v.n}</span>
                <h3 className="font-dm text-2xl text-linen-cream">{v.name}</h3>
                <p className="font-dm text-linen-cream/50 leading-relaxed text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Stats */}
      <section className="bg-off-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-2">
              <p className="font-dm text-[48px] leading-none text-amber-tan">
                <CountUp target={s.num} suffix={s.suffix} />
              </p>
              <p className="font-dm text-sm text-charcoal/50 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5 — CTA */}
      <section className="bg-obsidian py-28 px-6 text-center">
        <motion.h2
          initial={hidden}
          whileInView={visibleFadeUp(0)}
          viewport={{ once: true, amount: 0.5 }}
          className="font-dm text-4xl md:text-5xl text-linen-cream mb-10"
        >
          Ready to find your style?
        </motion.h2>
        <motion.div
          initial={hidden}
          whileInView={visibleFadeUp(0.15)}
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/shop/men"
            className="px-10 py-4 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors duration-300"
          >
            Shop Men
          </Link>
          <Link
            href="/shop/women"
            className="px-10 py-4 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors duration-300"
          >
            Shop Women
          </Link>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
