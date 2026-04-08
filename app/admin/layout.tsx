"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  BarChart2, Zap, Settings, Menu, X, Bell, LogOut, Calendar,
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
  { href: "/admin/calendar",  label: "Calendar",   icon: Calendar        },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart2       },
  { href: "/admin/settings",  label: "Settings",   icon: Settings        },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Close notif dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notif]")) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // Fetch pending orders count for notification bell
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
    // Real-time updates
    const channel = supabase
      .channel("admin_notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchPending)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  // Auth guard — only redirect after loading completes
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth");
    else if (!isAdmin) router.replace("/shop");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isAdmin]);

  // Only block render while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-tan/30 border-t-amber-tan rounded-full animate-spin mx-auto mb-4" />
          <p className="font-dm text-xs text-linen-cream/30 tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authorized — render nothing while redirect fires
  if (!user || !isAdmin) return null;

  const pageTitle = NAV.find((n) => n.href === pathname)?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-obsidian flex text-linen-cream" style={{
      // Design system CSS vars used by admin pages
      "--adm-bg":      "#0a0a0a",
      "--adm-surface": "#111111",
      "--adm-surface2":"#181818",
      "--adm-border":  "#2a2a2a",
      "--adm-text":    "#e8e4de",
      "--adm-text2":   "#8a8480",
      "--adm-text3":   "#555",
      "--adm-accent":  "#c9a96e",
    } as React.CSSProperties}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-56 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "var(--adm-surface)", borderRight: "1px solid var(--adm-border)" }}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 shrink-0" style={{ borderBottom: "1px solid var(--adm-border)" }}>
          <div>
            <span style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: 28, fontWeight: 300, letterSpacing: 6, color: "#e8d5b0", textTransform: "uppercase" }}>Voxe</span>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginTop: 2 }}>Admin Panel</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: "#555" }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                style={active ? {
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                  borderRadius: 8, fontSize: 13, background: "rgba(201,169,110,0.12)",
                  color: "#c9a96e", borderLeft: "2px solid #c9a96e", textDecoration: "none",
                } : {
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                  borderRadius: 8, fontSize: 13, color: "#8a8480", borderLeft: "2px solid transparent",
                  textDecoration: "none",
                }}>
                <Icon size={15} style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }} />
                {label}
                {label === "Drops" && (
                  <span style={{ marginLeft: "auto", fontSize: 9, background: "rgba(201,169,110,0.2)", color: "#c9a96e", padding: "2px 6px", borderRadius: 10, letterSpacing: 1 }}>NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider + store link */}
        <div className="px-6 py-5 shrink-0 space-y-3" style={{ borderTop: "1px solid var(--adm-border)" }}>
          <Link href="/" className="flex items-center gap-2" style={{ fontSize: 11, color: "#555", letterSpacing: 3, textTransform: "uppercase", textDecoration: "none" }}>
            <span>←</span> Back to Store
          </Link>
          <div className="flex items-center gap-3">
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b6914)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "#000" }}>
                {(user.user_metadata?.full_name ?? user.email ?? "AD").slice(0,2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p style={{ fontSize: 12, color: "var(--adm-text)", fontWeight: 500 }} className="truncate">{user.user_metadata?.full_name ?? "Admin"}</p>
              <p style={{ fontSize: 10, color: "var(--adm-text3)" }} className="truncate">{user.email}</p>
            </div>
            <button onClick={() => { logout().then(() => { router.push("/auth"); router.refresh(); }); }} className="ml-auto" style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }} aria-label="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0"
          style={{ background: "var(--adm-surface)", borderBottom: "1px solid var(--adm-border)" }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: "#555" }}>
              <Menu size={20} />
            </button>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: "var(--adm-text)" }}>
              {pageTitle}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ fontSize: 11, color: "var(--adm-text3)", fontFamily: "'DM Mono',monospace", padding: "6px 12px", background: "var(--adm-surface2)", border: "1px solid var(--adm-border)", borderRadius: 6 }}>
              {new Date().toLocaleDateString("en-NG", { month: "short", day: "2-digit", year: "numeric" })}
            </div>
            <div className="relative" data-notif>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--adm-text3)" }}
              >
                <Bell size={17} />
                {pendingCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#c9a96e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#000" }}>
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 280, background: "#111", border: "1px solid #2a2a2a", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", borderRadius: 12, zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--adm-text)", fontWeight: 500 }}>Notifications</span>
                    {pendingCount > 0 && <span style={{ fontSize: 9, color: "#c9a96e", background: "rgba(201,169,110,0.1)", padding: "2px 8px", borderRadius: 10 }}>{pendingCount} pending</span>}
                  </div>
                  {pendingCount > 0 ? (
                    <div style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, background: "rgba(201,169,110,0.05)", border: "1px solid rgba(201,169,110,0.1)", borderRadius: 8 }}>
                        <ShoppingBag size={14} style={{ color: "#c9a96e", flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <p style={{ fontSize: 12, color: "var(--adm-text)" }}>{pendingCount} order{pendingCount > 1 ? "s" : ""} awaiting processing</p>
                          <Link href="/admin/orders" onClick={() => setNotifOpen(false)} style={{ fontSize: 10, color: "#c9a96e", textDecoration: "none", marginTop: 4, display: "inline-block" }}>View orders →</Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--adm-text3)", textAlign: "center", padding: "24px 0" }}>No new notifications</p>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b6914)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "#000" }}>
                  {(user.user_metadata?.full_name ?? user.email ?? "A")[0].toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block min-w-0">
                <p style={{ fontSize: 12, color: "var(--adm-text)", fontWeight: 500 }} className="truncate max-w-[120px]">
                  {user.user_metadata?.full_name ?? user.email ?? "Admin"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ padding: 28, background: "var(--adm-bg)" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, color: "#c9a96e", textTransform: "uppercase", letterSpacing: "0.35em", marginBottom: 4 }}>VOXE Admin</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 300, color: "var(--adm-text)" }}>{pageTitle}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
