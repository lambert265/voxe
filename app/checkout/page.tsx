"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CreditCard, Building2, Package, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { formatNGN } from "@/lib/products";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const SHIPPING_COST = 3500;

const STEPS = ["Delivery", "Payment", "Confirm"];

type PayMethod = "card" | "transfer" | "pod";

const PAYMENT_OPTIONS: { id: PayMethod; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: "card",     label: "Card Payment",    sub: "Visa, Mastercard via Paystack", icon: <CreditCard size={18} /> },
  { id: "transfer", label: "Bank Transfer",   sub: "Direct bank transfer",          icon: <Building2 size={18} /> },
  { id: "pod",      label: "Pay on Delivery", sub: "Cash on delivery",              icon: <Package size={18} /> },
];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-dm text-xs text-charcoal/55 tracking-wide uppercase">{label}</label>
      {children}
      {error && <p className="font-dm text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = "w-full border border-charcoal/15 bg-white px-4 py-3 font-dm text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-amber-tan transition-colors rounded-sm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", state: "", lga: "",
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = SHIPPING_COST;
  const total = subtotal + shipping;

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    if (!form.phone.trim())   e.phone   = "Phone number is required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.state)          e.state   = "Please select a state";
    if (!form.lga.trim())     e.lga     = "LGA is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 0 && !validate()) return;
    if (step < 2) { setStep(step + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }

  function handlePlaceOrder() {
    clear();
    router.push("/checkout/success");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-off-white pt-[68px]">
        {/* Progress bar */}
        <div className="bg-white border-b border-charcoal/8">
          <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-dm text-xs font-semibold transition-colors duration-300 ${
                    i < step ? "bg-amber-tan text-obsidian" :
                    i === step ? "bg-obsidian text-linen-cream" :
                    "bg-charcoal/10 text-charcoal/35"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`font-dm text-[10px] tracking-widest uppercase transition-colors ${
                    i === step ? "text-amber-tan" : "text-charcoal/35"
                  }`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-20 sm:w-32 h-px mx-3 mb-5 transition-colors duration-300 ${i < step ? "bg-amber-tan" : "bg-charcoal/12"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left — form */}
            <div className="flex-[60] min-w-0 space-y-10">

              {/* Step 0 — Delivery */}
              {step === 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <h2 className="font-playfair text-2xl text-charcoal mb-7">Delivery Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name" error={errors.name}>
                      <input value={form.name} onChange={(e) => set("name", e.target.value)}
                        placeholder="Ada Okonkwo" className={inputCls} />
                    </Field>
                    <Field label="Email Address" error={errors.email}>
                      <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                        placeholder="ada@example.com" className={inputCls} />
                    </Field>
                    <Field label="Phone Number" error={errors.phone}>
                      <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                        placeholder="+234 800 000 0000" className={inputCls} />
                    </Field>
                    <Field label="State" error={errors.state}>
                      <div className="relative">
                        <select value={form.state} onChange={(e) => set("state", e.target.value)}
                          className={`${inputCls} appearance-none pr-10`}>
                          <option value="">Select state</option>
                          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="LGA" error={errors.lga}>
                      <input value={form.lga} onChange={(e) => set("lga", e.target.value)}
                        placeholder="Local Government Area" className={inputCls} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Delivery Address" error={errors.address}>
                        <textarea value={form.address} onChange={(e) => set("address", e.target.value)}
                          placeholder="Street address, apartment, landmark..."
                          rows={3} className={`${inputCls} resize-none`} />
                      </Field>
                    </div>
                  </div>
                  <button onClick={handleNext}
                    className="mt-8 w-full h-[52px] bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300 rounded-sm">
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {/* Step 1 — Payment */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <h2 className="font-playfair text-2xl text-charcoal mb-7">Payment Method</h2>
                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => setPayMethod(opt.id)}
                        className={`w-full flex items-center gap-4 p-5 border-2 rounded-sm text-left transition-colors duration-200 ${
                          payMethod === opt.id
                            ? "border-amber-tan bg-amber-tan/5"
                            : "border-charcoal/12 bg-white hover:border-charcoal/25"
                        }`}>
                        {/* Radio dot */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          payMethod === opt.id ? "border-amber-tan" : "border-charcoal/25"
                        }`}>
                          {payMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-amber-tan" />}
                        </div>
                        <div className={`transition-colors ${payMethod === opt.id ? "text-amber-tan" : "text-charcoal/50"}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <p className="font-dm font-medium text-charcoal text-sm">{opt.label}</p>
                          <p className="font-dm text-charcoal/40 text-xs mt-0.5">{opt.sub}</p>
                        </div>
                        {opt.id === "card" && (
                          <span className="ml-auto font-dm text-[10px] font-bold tracking-widest text-charcoal/30 uppercase">
                            Paystack
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={() => setStep(0)}
                      className="h-[52px] px-8 border border-charcoal/20 text-charcoal font-dm text-[11px] tracking-[0.2em] uppercase hover:border-charcoal transition-colors rounded-sm">
                      ← Back
                    </button>
                    <button onClick={handleNext}
                      className="flex-1 h-[52px] bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300 rounded-sm">
                      Review Order →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Confirm */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <h2 className="font-playfair text-2xl text-charcoal mb-7">Review Your Order</h2>

                  {/* Delivery summary */}
                  <div className="bg-white border border-charcoal/10 rounded-sm p-5 mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-dm text-xs text-charcoal/45 uppercase tracking-widest">Delivery</p>
                      <button onClick={() => setStep(0)} className="font-dm text-xs text-amber-tan hover:underline">Edit</button>
                    </div>
                    <p className="font-dm text-sm text-charcoal font-medium">{form.name}</p>
                    <p className="font-dm text-sm text-charcoal/55 mt-0.5">{form.address}, {form.lga}, {form.state}</p>
                    <p className="font-dm text-sm text-charcoal/55">{form.phone} · {form.email}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="bg-white border border-charcoal/10 rounded-sm p-5 mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-dm text-xs text-charcoal/45 uppercase tracking-widest">Payment</p>
                      <button onClick={() => setStep(1)} className="font-dm text-xs text-amber-tan hover:underline">Edit</button>
                    </div>
                    <p className="font-dm text-sm text-charcoal font-medium">
                      {PAYMENT_OPTIONS.find((o) => o.id === payMethod)?.label}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)}
                      className="h-[52px] px-8 border border-charcoal/20 text-charcoal font-dm text-[11px] tracking-[0.2em] uppercase hover:border-charcoal transition-colors rounded-sm">
                      ← Back
                    </button>
                    <button onClick={handlePlaceOrder}
                      className="flex-1 h-[52px] bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300 rounded-sm">
                      Place Order →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right — sticky order summary */}
            <div className="flex-[40] min-w-0">
              <div className="sticky top-[88px] bg-obsidian text-linen-cream rounded-xl p-6 space-y-5">
                <h2 className="font-playfair text-xl">Your Order</h2>

                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-dm text-sm text-linen-cream leading-snug truncate">{item.name}</p>
                        <p className="font-dm text-xs text-linen-cream/40 mt-0.5">{item.size} · {item.color} · ×{item.quantity}</p>
                      </div>
                      <p className="font-dm text-sm text-linen-cream shrink-0">{formatNGN(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 font-dm text-sm">
                  <div className="flex justify-between">
                    <span className="text-linen-cream/55">Subtotal</span>
                    <span>{formatNGN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-linen-cream/55">Shipping</span>
                    <span>{shipping === 0 ? formatNGN(0) : formatNGN(shipping)}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="font-dm font-semibold text-sm">Total</span>
                  <span className="font-dm font-bold text-amber-tan text-xl">{formatNGN(total)}</span>
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-linen-cream/30">
                    <Lock size={11} />
                    <span className="font-dm text-[11px]">Secure checkout</span>
                  </div>
                  <span className="text-linen-cream/15 text-xs">|</span>
                  <span className="font-dm text-[11px] text-linen-cream/30 font-semibold tracking-wider">Paystack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
