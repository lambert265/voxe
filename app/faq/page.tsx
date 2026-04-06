"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Orders",
    items: [
      { q: "How do I place an order?", a: "Browse the shop, select your size and colour, then click 'Add to Cart'. When you're ready, go to your cart and proceed to checkout. You'll need to provide a delivery address and choose a payment method." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Contact us immediately at orders@voxe.ng if you need to make changes." },
      { q: "Do I need an account to order?", a: "No — you can check out as a guest. However, creating an account lets you track orders, save your address, and access order history." },
      { q: "What payment methods do you accept?", a: "We accept card payments (Visa, Mastercard) via Paystack, direct bank transfer, and pay on delivery for eligible locations." },
    ],
  },
  {
    category: "Shipping",
    items: [
      { q: "How long does delivery take?", a: "Lagos: 1–2 business days. Abuja / Port Harcourt: 2–3 business days. Other states: 3–5 business days. Express options are available at checkout." },
      { q: "Is there free shipping?", a: "Yes — orders over ₦50,000 qualify for free standard delivery anywhere in Nigeria." },
      { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive an SMS and email with a tracking number. You can also use our Track Order page." },
      { q: "Do you ship internationally?", a: "Not yet — we currently ship within Nigeria only. International shipping is coming soon." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for items that are unworn, unwashed, and in original condition with tags attached." },
      { q: "How do I start a return?", a: "Email returns@voxe.ng with your order number and reason. We'll send you return instructions within 24 hours." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 3–5 business days of receiving your return. You'll get a confirmation email once it's done." },
      { q: "Can I exchange for a different size?", a: "Yes — exchanges are free. Just mention the size you want when initiating your return and we'll ship the replacement at no extra cost." },
    ],
  },
  {
    category: "Products",
    items: [
      { q: "How do I find my size?", a: "Visit our Size Guide page for detailed measurements for clothing and footwear. If you're between sizes, we recommend sizing up." },
      { q: "Are your products true to size?", a: "Most pieces run true to size. Product pages note any exceptions — for example, oversized fits are labelled accordingly." },
      { q: "How do I care for my VOXE pieces?", a: "Care instructions are on each product's label and on the product page under 'Care Instructions'. Most pieces are dry clean or hand wash cold." },
      { q: "Will sold-out items be restocked?", a: "Popular items are restocked regularly. Use the 'Notify Me' option on sold-out products to get an email when they're back." },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-charcoal/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-dm font-medium text-sm text-charcoal">{q}</span>
        <ChevronDown size={15} className={`shrink-0 text-amber-tan transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="font-dm text-sm text-charcoal/60 leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Orders");

  return (
    <>
      <Navbar />
      <div className="bg-off-white pt-28 pb-14 text-center px-6">
        <h1 className="font-playfair text-5xl md:text-6xl text-charcoal mb-4">FAQs</h1>
        <p className="font-dm text-charcoal/50 text-lg max-w-md mx-auto">
          Everything you need to know about VOXE.
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {faqs.map((f) => (
            <button
              key={f.category}
              onClick={() => setActiveCategory(f.category)}
              className={`px-5 py-2.5 rounded-full font-dm text-sm font-medium transition-all duration-200 ${
                activeCategory === f.category
                  ? "bg-amber-tan text-obsidian"
                  : "bg-white border border-charcoal/12 text-charcoal/60 hover:border-amber-tan hover:text-amber-tan"
              }`}
            >
              {f.category}
            </button>
          ))}
        </div>

        {/* Questions */}
        {faqs.filter((f) => f.category === activeCategory).map((f) => (
          <div key={f.category} className="bg-white border border-linen-cream rounded-sm px-6">
            {f.items.map((item) => (
              <AccordionItem key={item.q} {...item} />
            ))}
          </div>
        ))}

        {/* Still need help */}
        <div className="mt-16 bg-obsidian text-linen-cream rounded-sm p-10 text-center space-y-4">
          <h2 className="font-playfair text-2xl">Still have questions?</h2>
          <p className="font-dm text-sm text-linen-cream/50">Our team is available Monday – Saturday, 9am – 6pm WAT.</p>
          <a
            href="/contact"
            className="inline-block mt-2 px-8 py-3.5 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-linen-cream transition-colors duration-300 rounded-sm"
          >
            Contact Us
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
