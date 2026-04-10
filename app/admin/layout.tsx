"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  BarChart2, Zap, Settings, Menu, X, Bell, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin",           label: "Overview",   icon: LayoutDashboard },
  { href: "/admin/products",  label: "Products",   icon: Package         },
  { href: "/admin/orders",    label: "Orders",     icon: ShoppingBag     },
  { href: "/admin/customers", label: "Customers",  icon: Users           },
  { href: "/admin/inventory", label: "Inventory",  icon: Package         },
  { href: "/admin/drops",     label: "Drops",      icon: Zap             },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart2       },
  { href: "/admin/settings",  label: "Settings",   icon: Settings        },
];

const ADM = {
  bg:      "#0a0a0a",
  surface: "#111111",
  surface2:"#181818",
  border:  "#222222",
  text:    "#e8e4de",
  text2:   "#8a8480",
  text3:   "#555",
  accent:  "#c9a96e",
} as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Close notif on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // Fetch pending orders — only once when isAdmin becomes true
  useEffect(() => {
    if (!isAdmin) return;
    async function fetchPending() {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "Pending");
      setPendingCount(count ?? 0);
    }
    fetchPending();
    // Subscribe to order changes
    if (!channelRef.current) {
      channelRef.current = supabase
        .channel("admin_orders")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchPending)
        .subscribe();
    }
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Auth guard — wait for loading to finish, then check
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/auth"); return; }
    if (!isAdmin) {
      // Small delay to allow profiles table check to complete
      const t = setTimeout(() => router.replace("/shop"), 800);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: ADM.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="w-10 h-10 border-2 border-amber-tan/30 border-t-amber-tan rounded-full animate-spin mx-auto mb-4" />
          <p style={{ fontSize: 10, color: ADM.text3, letterSpacing: 3, textTransform: "uppercase" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const pageTitle = NAV.find((n) => n.href === pathname)?.label ?? "Admin";

  return (
    <div style={{ minHeight: "100vh", background: ADM.bg, display: "flex", color: ADM.text,
      ["--adm-bg" as string]: ADM.bg, ["--adm-surface" as string]: ADM.surface,
      ["--adm-surface2" as string]: ADM.surface2, ["--adm-border" as string]: ADM.border,
      ["--adm-text" as string]: ADM.text, ["--adm-text2" as string]: ADM.text2,
      ["--adm-text3" as string]: ADM.text3, ["--adm-accent" as string]: ADM.accent,
    }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-56 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: ADM.surface, borderRight: `1px solid ${ADM.border}` }}>
        <div className="flex items-center justify-between px-5 h-14 shrink-0" style={{ borderBottom: `1px solid ${ADM.border}` }}>
          <div>
            <span className="font-playfair text-xl text-amber-tan" style={{ letterSpacing: 2 }}>VOXE</span>
            <div style={{ fontSize: 9, letterSpacing: 3, color: ADM.text3, textTransform: "uppercase", marginTop: 1 }}>Admin</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: ADM.text3 }}><X size={16} /></button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} prefetch={true}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                  borderRadius: 8, fontSize: 13, textDecoration: "none",
                  background: active ? "rgba(201,169,110,0.1)" : "transparent",
                  color: active ? ADM.accent : ADM.text2,
                  borderLeft: `2px solid ${active ? ADM.accent : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                <Icon size={14} style={{ flexShrink: 0 }} />
                {label}
                {label === "Drops" && (
                  <span style={{ marginLeft: "auto", fontSize: 9, background: "rgba(201,169,110,0.15)", color: ADM.accent, padding: "2px 6px", borderRadius: 10 }}>NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 shrink-0" style={{ borderTop: `1px solid ${ADM.border}` }}>
          <Link href="/" prefetch={true} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: ADM.text3, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", marginBottom: 12 }}>
            ← Back to Store
          </Link>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="font-playfair text-sm text-obsidian font-bold">
                {(user.user_metadata?.full_name ?? user.email ?? "A")[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p style={{ fontSize: 12, color: ADM.text, fontWeight: 500 }} className="truncate">{user.user_metadata?.full_name ?? "Admin"}</p>
              <p style={{ fontSize: 10, color: ADM.text3 }} className="truncate">{user.email}</p>
            </div>
            <button onClick={() => { logout(); router.push("/auth"); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: ADM.text3, padding: 4 }} aria-label="Logout">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-5 sticky top-0 z-30 shrink-0"
          style={{ background: ADM.surface, borderBottom: `1px solid ${ADM.border}` }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: ADM.text3 }}><Menu size={18} /></button>
            <span className="font-playfair text-lg" style={{ color: ADM.text, fontWeight: 300 }}>{pageTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 11, color: ADM.text3, padding: "5px 10px", background: ADM.surface2, border: `1px solid ${ADM.border}`, borderRadius: 6 }}>
              {new Date().toLocaleDateString("en-NG", { month: "short", day: "2-digit", year: "numeric" })}
            </span>
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen((v) => !v)} className="relative"
                style={{ background: "none", border: "none", cursor: "pointer", color: ADM.text3 }}>
                <Bell size={16} />
                {pendingCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, width: 15, height: 15, background: ADM.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#000" }}>
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 260, background: ADM.surface, border: `1px solid ${ADM.border}`, borderRadius: 12, zIndex: 50, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <div style={{ padding: "10px 14px", borderBottom: `1px solid ${ADM.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: ADM.text, fontWeight: 500 }}>Notifications</span>
                    {pendingCount > 0 && <span style={{ fontSize: 9, color: ADM.accent, background: "rgba(201,169,110,0.1)", padding: "2px 8px", borderRadius: 10 }}>{pendingCount} pending</span>}
                  </div>
                  {pendingCount > 0 ? (
                    <div style={{ padding: 10 }}>
                      <div style={{ display: "flex", gap: 10, padding: 10, background: "rgba(201,169,110,0.05)", border: "1px solid rgba(201,169,110,0.1)", borderRadius: 8 }}>
                        <ShoppingBag size={13} style={{ color: ADM.accent, flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <p style={{ fontSize: 12, color: ADM.text }}>{pendingCount} order{pendingCount > 1 ? "s" : ""} awaiting processing</p>
                          <Link href="/admin/orders" onClick={() => setNotifOpen(false)} style={{ fontSize: 10, color: ADM.accent, textDecoration: "none", marginTop: 4, display: "inline-block" }}>View orders →</Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: ADM.text3, textAlign: "center", padding: "20px 0" }}>No new notifications</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: 24, background: ADM.bg }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 9, color: ADM.accent, textTransform: "uppercase", letterSpacing: "0.4em", marginBottom: 4 }}>VOXE Admin</p>
            <h1 className="font-playfair" style={{ fontSize: 28, fontWeight: 300, color: ADM.text }}>{pageTitle}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
