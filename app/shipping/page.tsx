import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "Standard Delivery",
    items: [
      ["Lagos", "1 – 2 business days", "₦1,500 (free over ₦50,000)"],
      ["Abuja / Port Harcourt", "2 – 3 business days", "₦2,000 (free over ₦50,000)"],
      ["Other Nigerian States", "3 – 5 business days", "₦3,500 (free over ₦50,000)"],
    ],
  },
  {
    title: "Express Delivery",
    items: [
      ["Lagos", "Same day (order before 12pm)", "₦3,500"],
      ["Abuja / Port Harcourt", "Next day", "₦5,000"],
      ["Other Nigerian States", "2 business days", "₦6,500"],
    ],
  },
];

const returnSteps = [
  { n: "01", title: "Initiate Return", body: "Email returns@voxe.ng within 30 days of delivery with your order number and reason for return." },
  { n: "02", title: "Pack Your Item", body: "Place the item in its original packaging (or any secure packaging). Include your order slip inside." },
  { n: "03", title: "Drop Off", body: "Drop the parcel at any GIG Logistics or DHL outlet near you. We'll send you the return address." },
  { n: "04", title: "Refund Processed", body: "Once we receive and inspect the item, your refund is processed within 3 – 5 business days to your original payment method." },
];

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <div className="bg-off-white pt-28 pb-14 text-center px-6">
        <h1 className="font-dm text-5xl md:text-6xl text-charcoal mb-4">Shipping & Returns</h1>
        <p className="font-dm text-charcoal/50 text-lg max-w-md mx-auto">
          Fast delivery across Nigeria. Hassle-free returns within 30 days.
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-16">

        {/* Delivery tables */}
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-dm text-2xl text-charcoal mb-6">{s.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-dm border-collapse">
                <thead>
                  <tr className="bg-amber-tan text-obsidian">
                    <th className="py-3 px-4 text-left font-semibold">Location</th>
                    <th className="py-3 px-4 text-left font-semibold">Estimated Time</th>
                    <th className="py-3 px-4 text-left font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {s.items.map(([loc, time, cost], i) => (
                    <tr key={loc} className={i % 2 === 0 ? "bg-white" : "bg-off-white"}>
                      <td className="py-3 px-4 font-medium text-charcoal">{loc}</td>
                      <td className="py-3 px-4 text-charcoal/70">{time}</td>
                      <td className="py-3 px-4 text-charcoal/70">{cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Notes */}
        <section className="bg-white border border-linen-cream rounded-sm p-7 space-y-3">
          <h2 className="font-dm text-xl text-charcoal">Important Notes</h2>
          <ul className="font-dm text-sm text-charcoal/65 space-y-2 list-disc list-inside leading-relaxed">
            <li>Orders placed before 2pm on weekdays are dispatched same day.</li>
            <li>Weekend orders are processed the next business day.</li>
            <li>Delivery times are estimates and may vary during peak periods.</li>
            <li>You will receive an SMS and email with your tracking number once dispatched.</li>
          </ul>
        </section>

        {/* Returns */}
        <section>
          <h2 className="font-dm text-2xl text-charcoal mb-2">Returns Policy</h2>
          <p className="font-dm text-charcoal/55 text-sm mb-10 leading-relaxed">
            We accept returns within <strong className="text-charcoal font-semibold">30 days</strong> of delivery for items that are unworn, unwashed, and in original condition with tags attached. Sale items and underwear are non-returnable.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {returnSteps.map((step) => (
              <div key={step.n} className="bg-white border border-linen-cream rounded-sm p-6 space-y-2">
                <span className="font-dm text-3xl text-amber-tan">{step.n}</span>
                <p className="font-dm text-lg text-charcoal">{step.title}</p>
                <p className="font-dm text-sm text-charcoal/60 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Refund types */}
        <section className="bg-obsidian text-linen-cream rounded-sm p-8 space-y-5">
          <h2 className="font-dm text-2xl">Refund Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-dm text-sm">
            {[
              { label: "Original Payment", desc: "Refunded to your card or bank account within 3 – 5 business days." },
              { label: "Store Credit", desc: "Instant credit added to your VOXE account — never expires." },
              { label: "Exchange", desc: "Swap for a different size or colour. We'll ship the replacement free." },
            ].map((r) => (
              <div key={r.label} className="border border-white/10 rounded-sm p-5 space-y-2">
                <p className="font-semibold text-amber-tan">{r.label}</p>
                <p className="text-linen-cream/55 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
