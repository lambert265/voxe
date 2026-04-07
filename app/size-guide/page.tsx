"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const clothingMenRows = [
  { label: "Chest (cm)", vals: ["86–91", "91–96", "96–101", "101–106", "106–111", "111–116", "116–121"] },
  { label: "Chest (in)", vals: ['34–36"', '36–38"', '38–40"', '40–42"', '42–44"', '44–46"', '46–48"'] },
  { label: "Waist (cm)", vals: ["71–76", "76–81", "81–86", "86–91", "91–96", "96–101", "101–106"] },
  { label: "Waist (in)", vals: ['28–30"', '30–32"', '32–34"', '34–36"', '36–38"', '38–40"', '40–42"'] },
];

const clothingWomenRows = [
  { label: "Bust (cm)",  vals: ["79–84", "84–89", "89–94", "94–99", "99–104", "104–109", "109–114"] },
  { label: "Bust (in)",  vals: ['31–33"', '33–35"', '35–37"', '37–39"', '39–41"', '41–43"', '43–45"'] },
  { label: "Waist (cm)", vals: ["61–66", "66–71", "71–76", "76–81", "81–86", "86–91", "91–96"] },
  { label: "Waist (in)", vals: ['24–26"', '26–28"', '28–30"', '30–32"', '32–34"', '34–36"', '36–38"'] },
  { label: "Hips (cm)",  vals: ["86–91", "91–96", "96–101", "101–106", "106–111", "111–116", "116–121"] },
  { label: "Hips (in)",  vals: ['34–36"', '36–38"', '38–40"', '40–42"', '42–44"', '44–46"', '46–48"'] },
];

const shoeRows = [
  { eu: 35, uk: 2.5, usM: 4,    usW: 5,    cm: 22.5 },
  { eu: 36, uk: 3,   usM: 4.5,  usW: 5.5,  cm: 23   },
  { eu: 37, uk: 4,   usM: 5,    usW: 6,    cm: 23.5 },
  { eu: 38, uk: 5,   usM: 6,    usW: 7,    cm: 24   },
  { eu: 39, uk: 6,   usM: 7,    usW: 8,    cm: 25   },
  { eu: 40, uk: 6.5, usM: 7.5,  usW: 8.5,  cm: 25.5 },
  { eu: 41, uk: 7,   usM: 8,    usW: 9,    cm: 26   },
  { eu: 42, uk: 8,   usM: 9,    usW: 10,   cm: 26.5 },
  { eu: 43, uk: 9,   usM: 10,   usW: 11,   cm: 27.5 },
  { eu: 44, uk: 9.5, usM: 10.5, usW: 11.5, cm: 28   },
  { eu: 45, uk: 10,  usM: 11,   usW: 12,   cm: 28.5 },
  { eu: 46, uk: 11,  usM: 12,   usW: 13,   cm: 29.5 },
  { eu: 47, uk: 12,  usM: 13,   usW: 14,   cm: 30   },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

function SizeTable({ rows, cols }: { rows: { label: string; vals: string[] }[]; cols: string[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-amber-tan/10">
      <table className="w-full text-sm font-dm border-collapse">
        <thead>
          <tr className="bg-amber-tan text-obsidian">
            <th className="py-3 px-4 text-left font-semibold">Measurement</th>
            {cols.map((c) => <th key={c} className="py-3 px-4 text-center font-semibold">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-white/3" : "bg-white/6"}>
              <td className="py-3 px-4 font-medium text-linen-cream">{row.label}</td>
              {row.vals.map((v, j) => (
                <td key={j} className="py-3 px-4 text-center text-linen-cream/60">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MeasureCard({ title, instruction, children }: { title: string; instruction: string; children: React.ReactNode }) {
  return (
    <div className="card-gloss rounded-xl p-6 border border-amber-tan/10 flex flex-col items-center gap-3 text-center">
      {children}
      <p className="font-dm text-sm font-semibold text-linen-cream">{title}</p>
      <p className="font-dm text-xs text-linen-cream/45 leading-relaxed">{instruction}</p>
    </div>
  );
}

export default function SizeGuidePage() {
  const [tab, setTab] = useState<"clothing" | "footwear">("clothing");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.4em] mb-4">
            Sizing
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="font-playfair text-5xl md:text-6xl text-linen-cream mb-4">
            Find Your Fit
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-dm text-linen-cream/40 text-base max-w-sm mx-auto">
            Use our size guide to find the perfect fit. VOXE fits slightly oversized — size down for a tighter fit.
          </motion.p>
        </section>

        {/* Tab switcher */}
        <div className="sticky top-[68px] z-10 bg-obsidian/95 backdrop-blur-md px-6 py-3">
          <div className="max-w-5xl mx-auto flex gap-2">
            {(["clothing", "footwear"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full font-dm text-sm font-medium transition-all duration-200 capitalize ${
                  tab === t ? "bg-amber-tan text-obsidian" : "border border-white/10 text-linen-cream/50 hover:border-amber-tan/40 hover:text-linen-cream"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-14">
          <AnimatePresence mode="wait">
            {tab === "clothing" ? (
              <motion.div key="clothing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-14">
                <section>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-6">How to Measure</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MeasureCard title="Chest" instruction="Measure around the fullest part of your chest, keeping the tape horizontal.">
                      <svg viewBox="0 0 80 120" className="w-20 h-28" fill="none">
                        <ellipse cx="40" cy="18" rx="12" ry="12" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
                        <path d="M28 30 C20 35 16 50 18 70 L22 100 L58 100 L62 70 C64 50 60 35 52 30" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.5" />
                        <path d="M18 70 L8 90 M62 70 L72 90" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
                        <line x1="22" y1="48" x2="58" y2="48" stroke="#C9A84C" strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx="22" cy="48" r="2" fill="#C9A84C" />
                        <circle cx="58" cy="48" r="2" fill="#C9A84C" />
                      </svg>
                    </MeasureCard>
                    <MeasureCard title="Waist" instruction="Measure around your natural waistline, the narrowest part of your torso.">
                      <svg viewBox="0 0 80 120" className="w-20 h-28" fill="none">
                        <ellipse cx="40" cy="18" rx="12" ry="12" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
                        <path d="M28 30 C20 35 16 50 18 70 L22 100 L58 100 L62 70 C64 50 60 35 52 30" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.5" />
                        <path d="M18 70 L8 90 M62 70 L72 90" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
                        <line x1="24" y1="62" x2="56" y2="62" stroke="#C9A84C" strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx="24" cy="62" r="2" fill="#C9A84C" />
                        <circle cx="56" cy="62" r="2" fill="#C9A84C" />
                      </svg>
                    </MeasureCard>
                    <MeasureCard title="Hips" instruction="Measure around the fullest part of your hips, about 20cm below your waist.">
                      <svg viewBox="0 0 80 120" className="w-20 h-28" fill="none">
                        <ellipse cx="40" cy="18" rx="12" ry="12" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
                        <path d="M28 30 C20 35 16 50 18 70 L22 100 L58 100 L62 70 C64 50 60 35 52 30" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.5" />
                        <path d="M18 70 L8 90 M62 70 L72 90" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
                        <line x1="18" y1="76" x2="62" y2="76" stroke="#C9A84C" strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx="18" cy="76" r="2" fill="#C9A84C" />
                        <circle cx="62" cy="76" r="2" fill="#C9A84C" />
                      </svg>
                    </MeasureCard>
                  </div>
                </section>
                <section>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-4">Men&apos;s Sizes</p>
                  <SizeTable rows={clothingMenRows} cols={sizes} />
                </section>
                <section>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-4">Women&apos;s Sizes</p>
                  <SizeTable rows={clothingWomenRows} cols={sizes} />
                </section>
              </motion.div>
            ) : (
              <motion.div key="footwear" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-14">
                <section>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-6">How to Measure Your Foot</p>
                  <div className="card-gloss rounded-xl p-8 border border-amber-tan/10 flex flex-col md:flex-row items-center gap-10">
                    <svg viewBox="0 0 120 160" className="w-32 h-44 shrink-0" fill="none">
                      <path d="M40 140 C20 138 14 120 16 100 C18 80 20 60 24 40 C28 20 36 10 46 10 C56 10 62 18 64 30 C68 24 76 22 82 28 C88 34 86 44 80 48 C86 50 90 58 88 66 C86 74 78 76 72 74 C74 82 72 92 68 100 C76 102 82 110 80 120 C78 130 68 140 56 142 Z" stroke="#C9A84C" strokeWidth="1.5" fill="#C9A84C" fillOpacity="0.05" />
                      <line x1="16" y1="150" x2="82" y2="150" stroke="#C9A84C" strokeWidth="2" />
                      <line x1="16" y1="146" x2="16" y2="154" stroke="#C9A84C" strokeWidth="2" />
                      <line x1="82" y1="146" x2="82" y2="154" stroke="#C9A84C" strokeWidth="2" />
                      <text x="49" y="148" textAnchor="middle" fontSize="8" fill="#C9A84C" fontFamily="sans-serif">Length</text>
                    </svg>
                    <div className="space-y-3">
                      <p className="font-dm text-sm font-semibold text-linen-cream">Step-by-step</p>
                      <ol className="font-dm text-sm text-linen-cream/50 space-y-2 list-decimal list-inside leading-relaxed">
                        <li>Place a sheet of paper on a hard floor and stand on it.</li>
                        <li>Trace the outline of your foot with a pencil held vertically.</li>
                        <li>Measure the distance from the heel to the longest toe in centimetres.</li>
                        <li>Use the measurement to find your size in the table below.</li>
                      </ol>
                    </div>
                  </div>
                </section>
                <section>
                  <p className="font-dm text-[10px] text-amber-tan uppercase tracking-widest mb-4">Size Conversion</p>
                  <div className="overflow-x-auto rounded-xl border border-amber-tan/10">
                    <table className="w-full text-sm font-dm border-collapse">
                      <thead>
                        <tr className="bg-amber-tan text-obsidian">
                          {["EU", "UK", "US Men", "US Women", "CM"].map((h) => (
                            <th key={h} className="py-3 px-4 text-center font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {shoeRows.map((row, i) => (
                          <tr key={row.eu} className={i % 2 === 0 ? "bg-white/3" : "bg-white/6"}>
                            <td className="py-3 px-4 text-center font-medium text-linen-cream">{row.eu}</td>
                            <td className="py-3 px-4 text-center text-linen-cream/60">{row.uk}</td>
                            <td className="py-3 px-4 text-center text-linen-cream/60">{row.usM}</td>
                            <td className="py-3 px-4 text-center text-linen-cream/60">{row.usW}</td>
                            <td className="py-3 px-4 text-center text-linen-cream/60">{row.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
