"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const clothingMenRows = [
  { label: "Chest (cm)", vals: ["86–91", "91–96", "96–101", "101–106", "106–111", "111–116", "116–121"] },
  { label: "Chest (in)", vals: ['34–36"', '36–38"', '38–40"', '40–42"', '42–44"', '44–46"', '46–48"'] },
  { label: "Waist (cm)", vals: ["71–76", "76–81", "81–86", "86–91", "91–96", "96–101", "101–106"] },
  { label: "Waist (in)", vals: ['28–30"', '30–32"', '32–34"', '34–36"', '36–38"', '38–40"', '40–42"'] },
];

const clothingWomenRows = [
  { label: "Bust (cm)", vals: ["79–84", "84–89", "89–94", "94–99", "99–104", "104–109", "109–114"] },
  { label: "Bust (in)", vals: ['31–33"', '33–35"', '35–37"', '37–39"', '39–41"', '41–43"', '43–45"'] },
  { label: "Waist (cm)", vals: ["61–66", "66–71", "71–76", "76–81", "81–86", "86–91", "91–96"] },
  { label: "Waist (in)", vals: ['24–26"', '26–28"', '28–30"', '30–32"', '32–34"', '34–36"', '36–38"'] },
  { label: "Hips (cm)", vals: ["86–91", "91–96", "96–101", "101–106", "106–111", "111–116", "116–121"] },
  { label: "Hips (in)", vals: ['34–36"', '36–38"', '38–40"', '40–42"', '42–44"', '44–46"', '46–48"'] },
];

const shoeRows = [
  { eu: 35, uk: 2.5, usM: 4, usW: 5, cm: 22.5 },
  { eu: 36, uk: 3, usM: 4.5, usW: 5.5, cm: 23 },
  { eu: 37, uk: 4, usM: 5, usW: 6, cm: 23.5 },
  { eu: 38, uk: 5, usM: 6, usW: 7, cm: 24 },
  { eu: 39, uk: 6, usM: 7, usW: 8, cm: 25 },
  { eu: 40, uk: 6.5, usM: 7.5, usW: 8.5, cm: 25.5 },
  { eu: 41, uk: 7, usM: 8, usW: 9, cm: 26 },
  { eu: 42, uk: 8, usM: 9, usW: 10, cm: 26.5 },
  { eu: 43, uk: 9, usM: 10, usW: 11, cm: 27.5 },
  { eu: 44, uk: 9.5, usM: 10.5, usW: 11.5, cm: 28 },
  { eu: 45, uk: 10, usM: 11, usW: 12, cm: 28.5 },
  { eu: 46, uk: 11, usM: 12, usW: 13, cm: 29.5 },
  { eu: 47, uk: 12, usM: 13, usW: 14, cm: 30 },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

function SizeTable({ rows, cols }: { rows: { label: string; vals: string[] }[]; cols: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-dm border-collapse">
        <thead>
          <tr className="bg-amber-tan text-obsidian">
            <th className="py-3 px-4 text-left font-semibold">Measurement</th>
            {cols.map((c) => (
              <th key={c} className="py-3 px-4 text-center font-semibold">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-off-white"}>
              <td className="py-3 px-4 font-medium text-charcoal">{row.label}</td>
              {row.vals.map((v, j) => (
                <td key={j} className="py-3 px-4 text-center text-charcoal/80">{v}</td>
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
    <div className="bg-white border border-linen-cream rounded-sm p-6 flex flex-col items-center gap-3 text-center">
      {children}
      <p className="font-playfair text-lg text-charcoal">{title}</p>
      <p className="font-dm text-sm text-charcoal/60 leading-relaxed">{instruction}</p>
    </div>
  );
}

export default function SizeGuidePage() {
  const [tab, setTab] = useState<"clothing" | "footwear">("clothing");

  return (
    <>
      <Navbar />
      {/* Header */}
      <div className="bg-off-white pt-28 pb-14 text-center px-6">
        <h1 className="font-playfair text-5xl md:text-6xl text-charcoal mb-4">Find Your Fit</h1>
        <p className="font-dm text-charcoal/55 text-lg max-w-md mx-auto">
          Use our size guide to find the perfect fit for clothing and footwear.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="bg-off-white border-b border-linen-cream sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 flex gap-8">
          {(["clothing", "footwear"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative py-4 font-dm font-medium text-sm tracking-wide capitalize transition-colors ${
                tab === t ? "text-charcoal" : "text-charcoal/45 hover:text-charcoal/70"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-tan" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-14 space-y-16">
        {tab === "clothing" ? (
          <>
            {/* How to Measure */}
            <section>
              <h2 className="font-playfair text-2xl text-charcoal mb-8">How to Measure</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MeasureCard title="Chest" instruction="Measure around the fullest part of your chest, keeping the tape horizontal.">
                  <svg viewBox="0 0 80 120" className="w-20 h-28" fill="none">
                    <ellipse cx="40" cy="18" rx="12" ry="12" stroke="#2A2A2A" strokeWidth="1.5" />
                    <path d="M28 30 C20 35 16 50 18 70 L22 100 L58 100 L62 70 C64 50 60 35 52 30" stroke="#2A2A2A" strokeWidth="1.5" fill="none" />
                    <path d="M18 70 L8 90 M62 70 L72 90" stroke="#2A2A2A" strokeWidth="1.5" />
                    <line x1="22" y1="48" x2="58" y2="48" stroke="#B5906A" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="22" cy="48" r="2" fill="#B5906A" />
                    <circle cx="58" cy="48" r="2" fill="#B5906A" />
                  </svg>
                </MeasureCard>
                <MeasureCard title="Waist" instruction="Measure around your natural waistline, the narrowest part of your torso.">
                  <svg viewBox="0 0 80 120" className="w-20 h-28" fill="none">
                    <ellipse cx="40" cy="18" rx="12" ry="12" stroke="#2A2A2A" strokeWidth="1.5" />
                    <path d="M28 30 C20 35 16 50 18 70 L22 100 L58 100 L62 70 C64 50 60 35 52 30" stroke="#2A2A2A" strokeWidth="1.5" fill="none" />
                    <path d="M18 70 L8 90 M62 70 L72 90" stroke="#2A2A2A" strokeWidth="1.5" />
                    <line x1="24" y1="62" x2="56" y2="62" stroke="#B5906A" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="24" cy="62" r="2" fill="#B5906A" />
                    <circle cx="56" cy="62" r="2" fill="#B5906A" />
                  </svg>
                </MeasureCard>
                <MeasureCard title="Hips" instruction="Measure around the fullest part of your hips, about 20cm below your waist.">
                  <svg viewBox="0 0 80 120" className="w-20 h-28" fill="none">
                    <ellipse cx="40" cy="18" rx="12" ry="12" stroke="#2A2A2A" strokeWidth="1.5" />
                    <path d="M28 30 C20 35 16 50 18 70 L22 100 L58 100 L62 70 C64 50 60 35 52 30" stroke="#2A2A2A" strokeWidth="1.5" fill="none" />
                    <path d="M18 70 L8 90 M62 70 L72 90" stroke="#2A2A2A" strokeWidth="1.5" />
                    <line x1="18" y1="76" x2="62" y2="76" stroke="#B5906A" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="18" cy="76" r="2" fill="#B5906A" />
                    <circle cx="62" cy="76" r="2" fill="#B5906A" />
                  </svg>
                </MeasureCard>
              </div>
            </section>

            {/* Men's Table */}
            <section>
              <h2 className="font-playfair text-2xl text-charcoal mb-6">Men&apos;s Sizes</h2>
              <SizeTable rows={clothingMenRows} cols={sizes} />
            </section>

            {/* Women's Table */}
            <section>
              <h2 className="font-playfair text-2xl text-charcoal mb-6">Women&apos;s Sizes</h2>
              <SizeTable rows={clothingWomenRows} cols={sizes} />
            </section>
          </>
        ) : (
          <>
            {/* How to Measure Foot */}
            <section>
              <h2 className="font-playfair text-2xl text-charcoal mb-8">How to Measure Your Foot</h2>
              <div className="bg-white border border-linen-cream rounded-sm p-8 flex flex-col md:flex-row items-center gap-10">
                <svg viewBox="0 0 120 160" className="w-32 h-44 shrink-0" fill="none">
                  <path d="M40 140 C20 138 14 120 16 100 C18 80 20 60 24 40 C28 20 36 10 46 10 C56 10 62 18 64 30 C68 24 76 22 82 28 C88 34 86 44 80 48 C86 50 90 58 88 66 C86 74 78 76 72 74 C74 82 72 92 68 100 C76 102 82 110 80 120 C78 130 68 140 56 142 Z" stroke="#2A2A2A" strokeWidth="1.5" fill="#F7F5F2" />
                  <line x1="16" y1="150" x2="82" y2="150" stroke="#B5906A" strokeWidth="2" />
                  <line x1="16" y1="146" x2="16" y2="154" stroke="#B5906A" strokeWidth="2" />
                  <line x1="82" y1="146" x2="82" y2="154" stroke="#B5906A" strokeWidth="2" />
                  <text x="49" y="148" textAnchor="middle" fontSize="8" fill="#B5906A" fontFamily="sans-serif">Length</text>
                </svg>
                <div className="space-y-3">
                  <p className="font-playfair text-xl text-charcoal">Step-by-step</p>
                  <ol className="font-dm text-sm text-charcoal/65 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Place a sheet of paper on a hard floor and stand on it.</li>
                    <li>Trace the outline of your foot with a pencil held vertically.</li>
                    <li>Measure the distance from the heel to the longest toe in centimetres.</li>
                    <li>Use the measurement to find your size in the table below.</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Shoe Size Table */}
            <section>
              <h2 className="font-playfair text-2xl text-charcoal mb-6">Size Conversion</h2>
              <div className="overflow-x-auto">
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
                      <tr key={row.eu} className={i % 2 === 0 ? "bg-white" : "bg-off-white"}>
                        <td className="py-3 px-4 text-center font-medium text-charcoal">{row.eu}</td>
                        <td className="py-3 px-4 text-center text-charcoal/80">{row.uk}</td>
                        <td className="py-3 px-4 text-center text-charcoal/80">{row.usM}</td>
                        <td className="py-3 px-4 text-center text-charcoal/80">{row.usW}</td>
                        <td className="py-3 px-4 text-center text-charcoal/80">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
