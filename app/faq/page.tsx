"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    category: "Orders",
    icon: "◈",
    items: [
      { q: "How do I place an order?", a: "Browse the shop, select your size and colour, then click 'Add to Cart'. When you're ready, go to your cart and proceed to checkout. You'll need to provide a delivery address and choose a payment method." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Contact us immediately at hello@voxe.com if you need to make changes." },
      { q: "Do I need an account to order?", a: "No — you can check out as a guest. However, creating an account lets you track orders, save your address, and access your full order history." },
      { q: "What payment methods do you accept?", a: "We accept card payments (Visa, Mastercard) via Paystack, direct bank transfer, and pay on delivery for eligible locations." },
    ],
  },
  {
    category: "Shipping",
    icon: "◉",
    items: [
      { q: "How long does delivery take?", a: "Lagos: 3–5 business days. Other states: 5–7 business days. All orders ship at a flat rate of ₦3,500." },
      { q: "How do I track my order?", a: "Once your order is dispatched, you can track it using your VXE-XXXXXX order ID on the Track Order page. You can also view all your orders in your account under My Orders." },
      { q: "Do you ship internationally?", a: "Not yet — we currently ship within Nigeria only. International shipping is coming soon." },
      { q: "What is the shipping cost?", a: "Flat rate of ₦3,500 on all orders, nationwide. No minimum order required." },
    ],
  },
  {
    category: "Returns",
    icon: "✦",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for items that are unworn, unwashed, and in original condition with tags attached." },
      { q: "How do I start a return?", a: "Email hello@voxe.com with your order number and reason. We'll send you return instructions within 24 hours." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 3–5 business days of receiving your return. You'll get a confirmation email once it's done." },
      { q: "Can I exchange for a different size?", a: "Yes — exchanges are free. Just mention the size you want when initiating your return and we'll ship the replacement at no extra cost." },
    ],
  },
  {
    category: "Products",
    icon: "◆",
    items: [
      { q: "How do I find my size?", a: "Visit our Size Guide page for detailed measurements for clothing and footwear. VOXE fits slightly oversized — size down for a tighter fit." },
      { q: "Are your products true to size?", a: "Most pieces run slightly oversized. Product pages note any exceptions. When in doubt, check the size guide or ask our assistant." },
      { q: "How do I care for my VOXE pieces?", a: "Care instructions are on each product's label and on the product page. Most pieces are dry clean or hand wash cold." },
      { q: "Will sold-out items be restocked?", a: "Popular items are restocked regularly. Keep an eye on the New Arrivals section or reach out to hello@voxe.com to ask about a specific piece." },
    ],
  },
];

function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-amber-tan/10 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className={`font-dm text-sm leading-snug transition-colors duration-200 ${open ? "text-amber-tan" : "text-linen-cream/80 group-hover:text-linen-cream"}`}>
          {q}
        </span>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${open ? "border-amber-tan bg-amber-tan/10" : "border-white/10 group-hover:border-amber-tan/40"}`}>
          <ChevronDown size={12} className={`text-amber-tan transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-dm text-sm text-linen-cream/50 leading-relaxed pb-5 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Orders");
  const [search, setSearch] = useState("");

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return FAQS.flatMap((f) =>
      f.items
        .filter((item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q))
        .map((item) => ({ ...item, category: f.category }))
    );
  }, [search]);

  const activeItems = FAQS.find((f) => f.category === activeCategory)?.items ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-4">
            Help Center
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            className="font-playfair text-5xl md:text-6xl text-linen-cream mb-4">
            FAQs
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="font-dm text-linen-cream/40 text-base max-w-sm mx-auto mb-10">
            Everything you need to know about VOXE.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="relative max-w-md mx-auto">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-linen-cream/25 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-3.5 font-dm text-sm text-linen-cream placeholder:text-linen-cream/25 focus:outline-none focus:border-amber-tan/40 transition-colors"
            />
          </motion.div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-16">

          {/* Search results */}
          {search.trim() ? (
            <div>
              <p className="font-dm text-xs text-linen-cream/30 uppercase tracking-widest mb-6">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
              </p>
              {searchResults.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-playfair text-2xl text-linen-cream/20 mb-2">No results found</p>
                  <p className="font-dm text-sm text-linen-cream/20">Try different keywords or browse by category below.</p>
                </div>
              ) : (
                <div className="card-gloss rounded-2xl px-6 divide-y divide-amber-tan/8">
                  {searchResults.map((item, i) => (
                    <div key={i}>
                      <p className="font-dm text-[10px] text-amber-tan/50 uppercase tracking-widest pt-5 mb-1">{item.category}</p>
                      <AccordionItem q={item.q} a={item.a} index={i} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 mb-10">
                {FAQS.map((f) => (
                  <button key={f.category} onClick={() => setActiveCategory(f.category)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-dm text-sm font-medium transition-all duration-200 ${
                      activeCategory === f.category
                        ? "bg-amber-tan text-obsidian"
                        : "border border-white/10 text-linen-cream/50 hover:border-amber-tan/40 hover:text-linen-cream"
                    }`}>
                    <span className="text-xs">{f.icon}</span>
                    {f.category}
                  </button>
                ))}
              </div>

              {/* Questions */}
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="card-gloss rounded-2xl px-6">
                  {activeItems.map((item, i) => (
                    <AccordionItem key={item.q} q={item.q} a={item.a} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {/* Still need help */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 relative overflow-hidden rounded-2xl border border-amber-tan/15 p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-tan/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-amber-tan/10 border border-amber-tan/25 flex items-center justify-center mx-auto mb-5">
                <MessageCircle size={20} className="text-amber-tan" />
              </div>
              <h2 className="font-playfair text-2xl text-linen-cream mb-2">Still have questions?</h2>
              <p className="font-dm text-sm text-linen-cream/40 mb-7">
                Our team is available Monday – Saturday, 9am – 6pm WAT.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact"
                  className="btn-amber sheen px-8 py-3.5 text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm">
                  Contact Us
                </Link>
                <a href="mailto:hello@voxe.com"
                  className="px-8 py-3.5 border border-amber-tan/25 text-amber-tan font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-sm hover:bg-amber-tan/10 transition-colors">
                  hello@voxe.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
