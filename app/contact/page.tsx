"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactInfo = [
  { icon: Mail,   label: "Email",   value: "hello@voxe.com",           sub: "We reply within 24 hours" },
  { icon: Phone,  label: "Phone",   value: "+234 800 VOXE 000",         sub: "Mon – Sat, 9am – 6pm WAT" },
  { icon: MapPin, label: "Address", value: "14 Bode Thomas St, Surulere", sub: "Lagos, Nigeria" },
  { icon: Clock,  label: "Hours",   value: "Mon – Sat: 9am – 6pm",     sub: "Closed Sundays & public holidays" },
];

const topics = ["Order Issue", "Return / Exchange", "Product Question", "Sizing Help", "Partnership", "Other"];

const inputCls = "w-full bg-white/5 border border-white/10 px-4 py-3.5 font-dm text-sm text-linen-cream placeholder:text-linen-cream/20 focus:outline-none focus:border-amber-tan/50 transition-colors rounded-lg";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim())    errs.name    = "Name is required";
    if (!form.email.trim())   errs.email   = "Email is required";
    if (!form.topic)          errs.topic   = "Please select a topic";
    if (!form.message.trim()) errs.message = "Message is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-4">
            Get In Touch
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="font-playfair text-5xl md:text-6xl text-linen-cream mb-4">
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-dm text-linen-cream/40 text-base max-w-sm mx-auto">
            We&apos;d love to hear from you. Reach out and we&apos;ll get back to you shortly.
          </motion.p>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left — contact info */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, sub }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 items-start p-4 rounded-xl border border-amber-tan/8 hover:border-amber-tan/20 transition-colors">
                  <div className="w-10 h-10 bg-amber-tan/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-amber-tan" />
                  </div>
                  <div>
                    <p className="font-dm text-[10px] text-amber-tan/50 uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="font-dm text-sm font-medium text-linen-cream">{value}</p>
                    <p className="font-dm text-xs text-linen-cream/35 mt-0.5">{sub}</p>
                  </div>
                </motion.div>
              ))}

              <div className="pt-2 px-4">
                <p className="font-dm text-[10px] text-amber-tan/50 uppercase tracking-widest mb-3">Follow Us</p>
                <div className="flex gap-4">
                  {["Instagram", "TikTok", "Twitter"].map((s) => (
                    <a key={s} href="#" className="font-dm text-xs text-linen-cream/35 hover:text-amber-tan transition-colors">{s}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20 space-y-5">
                    <div className="w-16 h-16 bg-amber-tan/10 border border-amber-tan/25 rounded-full flex items-center justify-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                        <CheckCircle size={28} className="text-amber-tan" />
                      </motion.div>
                    </div>
                    <h2 className="font-playfair text-3xl text-linen-cream">Message Sent.</h2>
                    <p className="font-dm text-sm text-linen-cream/40 max-w-xs leading-relaxed">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                      className="font-dm text-xs text-amber-tan hover:underline mt-2">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em]">Full Name</label>
                        <input value={form.name} onChange={(e) => set("name", e.target.value)}
                          placeholder="Ada Okonkwo" className={inputCls} />
                        {errors.name && <p className="font-dm text-xs text-red-400">{errors.name}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em]">Email Address</label>
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                          placeholder="ada@example.com" className={inputCls} />
                        {errors.email && <p className="font-dm text-xs text-red-400">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em]">Topic</label>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((t) => (
                          <button type="button" key={t} onClick={() => set("topic", t)}
                            className={`px-4 py-2 rounded-full font-dm text-xs font-medium transition-all duration-200 ${
                              form.topic === t
                                ? "bg-amber-tan text-obsidian"
                                : "border border-white/10 text-linen-cream/45 hover:border-amber-tan/40 hover:text-linen-cream"
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>
                      {errors.topic && <p className="font-dm text-xs text-red-400">{errors.topic}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-dm text-[10px] text-linen-cream/35 uppercase tracking-[0.15em]">Message</label>
                      <textarea value={form.message} onChange={(e) => set("message", e.target.value)}
                        placeholder="Tell us how we can help..." rows={5}
                        className={`${inputCls} resize-none`} />
                      {errors.message && <p className="font-dm text-xs text-red-400">{errors.message}</p>}
                    </div>

                    <button type="submit"
                      className="btn-amber sheen w-full h-[52px] text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase rounded-lg">
                      Send Message
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
