"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ALL_PRODUCTS, formatNGN } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw } from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Delivered:  { bg: "rgba(74,222,128,0.1)",  color: "#4ade80" },
  Processing: { bg: "rgba(96,165,250,0.1)",  color: "#60a5fa" },
  Shipped:    { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24" },
  Pending:    { bg: "rgba(255,255,255,0.05)", color: "#8a8480" },
  Cancelled:  { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
};

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  total: number;
  status: string;
};

type Stats = { revenue: number; orders: number; customers: number };

function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 120 32" preserveAspectRatio="none" style={{ width: "100%", height: 32 }}>
      <defs>
        <linearGradient id={`g-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={points} fill="none" stroke={color} strokeWidth="1.5" />
      <path d={points + " L120,32 L0,32Z"} fill={`url(#g-${color.replace("#","")})`} />
    </svg>
  );
}

export default function AdminOverview() {
  const supabase = createClient();
  const { } = useAuth();
  const [stats, setStats] = useState<Stats>({ revenue: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const { data: orders } = await supabase
      .from("orders")
      .select("id, created_at, customer_name, total, status")
      .order("created_at", { ascending: false });

    if (orders) {
      setStats({
        revenue: orders.reduce((s: number, o: Order) => s + (o.total ?? 0), 0),
        orders: orders.length,
        customers: new Set(orders.map((o: Order) => o.customer_name)).size,
      });
      setRecentOrders(orders.slice(0, 6));
    }
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    {
      label: "Revenue", value: formatNGN(stats.revenue), color: "#c9a96e",
      change: "+18.4% this month", up: true,
      points: "M0,26 L15,20 L30,23 L45,16 L60,18 L75,10 L90,13 L105,6 L120,3",
    },
    {
      label: "Total Orders", value: String(stats.orders), color: "#60a5fa",
      change: "+9.2% vs last month", up: true,
      points: "M0,22 L15,26 L30,18 L45,22 L60,14 L75,16 L90,8 L105,12 L120,6",
    },
    {
      label: "Customers", value: String(stats.customers), color: "#4ade80",
      change: "+22.1% new this month", up: true,
      points: "M0,28 L15,24 L30,26 L45,18 L60,20 L75,12 L90,14 L105,5 L120,3",
    },
    {
      label: "Active Products", value: String(ALL_PRODUCTS.length), color: "#a78bfa",
      change: "in catalogue", up: true,
      points: "M0,20 L15,18 L30,16 L45,14 L60,12 L75,10 L90,8 L105,6 L120,4",
    },
  ];

  const activity = [
    { color: "#4ade80", text: "New order — customer purchased item", time: "2m" },
    { color: "#60a5fa", text: "Low stock — Chain Tote Bag at 6 units", time: "14m" },
    { color: "#c9a96e", text: "New customer registered", time: "1h" },
    { color: "#f87171", text: "Return request — order flagged", time: "3h" },
  ];

  const health = [
    { label: "Site Uptime",       val: "99.9%", pct: 99, color: "#4ade80" },
    { label: "Page Speed",        val: "92ms",  pct: 85, color: "#c9a96e" },
    { label: "Payment Gateway",   val: "Online",pct: 100,color: "#4ade80" },
    { label: "Inventory Sync",    val: "74%",   pct: 74, color: "#fbbf24" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{
            background: "var(--adm-surface)", border: "1px solid var(--adm-border)",
            borderRadius: 12, padding: 20, position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>{s.label}</span>
            </div>
            {loading ? (
              <div style={{ height: 36, background: "rgba(201,169,110,0.08)", borderRadius: 6, marginBottom: 8 }} />
            ) : (
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, lineHeight: 1, marginBottom: 6, color: "var(--adm-text)" }}>{s.value}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: s.up ? "#4ade80" : "#f87171", marginBottom: 10 }}>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.5 10.5L12 3l7.5 7.5M12 3v18"/></svg>
              {s.change}
            </div>
            <Sparkline color={s.color} points={s.points} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        {/* Bar chart */}
        <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--adm-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>Sales Overview</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--adm-text)", marginTop: 2 }}>Monthly Revenue</div>
            </div>
            <span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.2)" }}>2026</span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
              {[["#c9a96e","Revenue"],["#2a2a2a","Last Year"]].map(([c,l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--adm-text2)" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, paddingBottom: 8 }}>
              {[["JAN",52,66],["FEB",45,70],["MAR",60,88],["APR",48,84],["MAY",68,108],["JUN",58,93],["JUL",42,76],["AUG",53,103],["SEP",66,116],["OCT",70,100],["NOV",78,86],["DEC",88,74]].map(([m,prev,curr]) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 120 }}>
                    <div style={{ width: 10, height: prev as number, borderRadius: "3px 3px 0 0", background: "#1f1f1f" }} />
                    <div style={{ width: 10, height: curr as number, borderRadius: "3px 3px 0 0", background: "#c9a96e" }} />
                  </div>
                  <span style={{ fontSize: 9, color: "var(--adm-text3)", letterSpacing: "0.5px" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut */}
        <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--adm-border)" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>Categories</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--adm-text)", marginTop: 2 }}>Sales Distribution</div>
          </div>
          <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
              <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="46" fill="none" stroke="#1f1f1f" strokeWidth="14"/>
                <circle cx="60" cy="60" r="46" fill="none" stroke="#c9a96e" strokeWidth="14" strokeDasharray="121 168" strokeDashoffset="0"/>
                <circle cx="60" cy="60" r="46" fill="none" stroke="#60a5fa" strokeWidth="14" strokeDasharray="81 168" strokeDashoffset="-121"/>
                <circle cx="60" cy="60" r="46" fill="none" stroke="#4ade80" strokeWidth="14" strokeDasharray="52 168" strokeDashoffset="-202"/>
                <circle cx="60" cy="60" r="46" fill="none" stroke="#a78bfa" strokeWidth="14" strokeDasharray="35 168" strokeDashoffset="-254"/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 300, lineHeight: 1 }}>Sales</div>
                <div style={{ fontSize: 9, color: "var(--adm-text3)", letterSpacing: 1, textTransform: "uppercase" }}>Total</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["#c9a96e","Womenswear","42%"],["#60a5fa","Menswear","28%"],["#4ade80","Accessories","18%"],["#a78bfa","Other","12%"]].map(([c,l,p]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--adm-text2)", flex: 1 }}>{l}</span>
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--adm-text)" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent orders */}
        <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--adm-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>Orders</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--adm-text)", marginTop: 2 }}>Recent Transactions</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={fetchData} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--adm-text3)" }}>
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </button>
              <Link href="/admin/orders" style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.2)", textDecoration: "none" }}>View All</Link>
            </div>
          </div>
          <div style={{ padding: "0 20px" }}>
            {loading ? (
              <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 36, background: "rgba(201,169,110,0.05)", borderRadius: 6 }} />)}
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--adm-text3)", fontSize: 12 }}>No orders yet</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Order","Customer","Total","Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)", padding: "12px 0", borderBottom: "1px solid var(--adm-border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, i) => {
                    const s = STATUS_STYLES[o.status] ?? STATUS_STYLES.Pending;
                    return (
                      <tr key={o.id} style={{ borderBottom: i < recentOrders.length - 1 ? "1px solid var(--adm-border)" : "none" }}>
                        <td style={{ padding: "11px 0", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#c9a96e" }}>#{o.id.slice(0,8).toUpperCase()}</td>
                        <td style={{ padding: "11px 0 11px 12px", fontSize: 12, color: "var(--adm-text)" }}>{o.customer_name}</td>
                        <td style={{ padding: "11px 0 11px 12px", fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{formatNGN(o.total)}</td>
                        <td style={{ padding: "11px 0 11px 12px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 10, background: s.bg, color: s.color }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity + Health */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Activity */}
          <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--adm-border)" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>Activity</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--adm-text)", marginTop: 2 }}>Recent Events</div>
            </div>
            <div style={{ padding: "0 20px" }}>
              {activity.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < activity.length - 1 ? "1px solid var(--adm-border)" : "none", alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 4, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, lineHeight: 1.5, flex: 1, color: "var(--adm-text2)" }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: "var(--adm-text3)", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Store health */}
          <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--adm-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>System</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--adm-text)", marginTop: 2 }}>Store Health</div>
              </div>
              <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "3px 8px", borderRadius: 10 }}>Excellent</span>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {health.map((h) => (
                <div key={h.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--adm-text2)" }}>{h.label}</span>
                    <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: h.color }}>{h.val}</span>
                  </div>
                  <div style={{ height: 3, background: "#1f1f1f", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${h.pct}%`, background: h.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
