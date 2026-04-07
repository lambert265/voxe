"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

const inputCls = "w-full border border-charcoal/15 bg-white px-4 py-3.5 font-dm text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-amber-tan transition-colors rounded-sm";

const contactInfo = [
  { icon: Mail,    label: "Email",   value: "hello@voxe.ng",          sub: "We reply within 24 hours" },
  { icon: Phone,   label: "Phone",   value: "+234 800 VOXE 000",       sub: "Mon – Sat, 9am – 6pm WAT" },
  { icon: MapPin,  label: "Address", value: "14 Bode Thomas St, Surulere", sub: "Lagos, Nigeria" },
  { icon: Clock,   label: "Hours",   value: "Mon – Sat: 9am – 6pm",   sub: "Closed Sundays & public holidays" },
];

const topics = ["Order Issue", "Return / Exchange", "Product Question", "Sizing Help", "Partnership", "Other"];

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
      <div className="bg-off-white pt-28 pb-14 text-center px-6">
        <h1 className="font-dm text-5xl md:text-6xl text-charcoal mb-4">Contact Us</h1>
        <p className="font-dm text-charcoal/50 text-lg max-w-md mx-auto">
          We&apos;d love to hear from you. Reach out and we&apos;ll get back to you shortly.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — contact info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-amber-tan/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-amber-tan" />
                </div>
                <div>
                  <p className="font-dm text-[10px] text-charcoal/40 uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="font-dm text-sm font-medium text-charcoal">{value}</p>
                  <p className="font-dm text-xs text-charcoal/45 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-charcoal/8">
              <p className="font-dm text-[10px] text-charcoal/40 uppercase tracking-widest mb-3">Follow Us</p>
              <div className="flex gap-3">
                {["Instagram", "TikTok", "Twitter"].map((s) => (
                  <a key={s} href="#" className="font-dm text-xs text-charcoal/50 hover:text-amber-tan transition-colors">{s}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-14 h-14 bg-amber-tan/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} className="text-amber-tan" />
                </div>
                <h2 className="font-dm text-2xl text-charcoal">Message Sent!</h2>
                <p className="font-dm text-sm text-charcoal/50 max-w-xs leading-relaxed">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                  className="mt-2 font-dm text-xs text-amber-tan hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-dm text-xs text-charcoal/50 uppercase tracking-wide">Full Name</label>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)}
                      placeholder="Ada Okonkwo" className={inputCls} />
                    {errors.name && <p className="font-dm text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-dm text-xs text-charcoal/50 uppercase tracking-wide">Email Address</label>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                      placeholder="ada@example.com" className={inputCls} />
                    {errors.email && <p className="font-dm text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-dm text-xs text-charcoal/50 uppercase tracking-wide">Topic</label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <button type="button" key={t} onClick={() => set("topic", t)}
                        className={`px-4 py-2 rounded-full font-dm text-xs font-medium transition-all duration-200 ${
                          form.topic === t
                            ? "bg-amber-tan text-obsidian"
                            : "bg-white border border-charcoal/12 text-charcoal/60 hover:border-amber-tan hover:text-amber-tan"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.topic && <p className="font-dm text-xs text-red-500">{errors.topic}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="font-dm text-xs text-charcoal/50 uppercase tracking-wide">Message</label>
                  <textarea value={form.message} onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us how we can help..." rows={5}
                    className={`${inputCls} resize-none`} />
                  {errors.message && <p className="font-dm text-xs text-red-500">{errors.message}</p>}
                </div>

                <button type="submit"
                  className="w-full h-[52px] bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300 rounded-sm">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
