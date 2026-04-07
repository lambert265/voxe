"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  BarChart2, Zap, Settings, Menu, X, Bell, Search, LogOut,
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
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
    <div className="min-h-screen bg-obsidian flex text-linen-cream">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0D0B06] border-r border-amber-tan/10 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-amber-tan/10 shrink-0">
          <div>
            <span className="font-dm text-2xl font-bold text-amber-tan" style={{ letterSpacing: "-1px" }}>VOXE</span>
            <span className="font-dm text-[9px] text-amber-tan/40 tracking-[0.3em] uppercase ml-2">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-linen-cream/30 hover:text-linen-cream transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-dm text-sm transition-all duration-150 ${
                  active
                    ? "bg-amber-tan text-obsidian font-semibold"
                    : "text-linen-cream/40 hover:bg-amber-tan/8 hover:text-linen-cream"
                }`}>
                <Icon size={15} className={active ? "text-obsidian" : ""} />
                {label}
                {label === "Drops" && (
                  <span className="ml-auto font-dm text-[9px] bg-amber-tan/20 text-amber-tan px-1.5 py-0.5 rounded-full tracking-wider">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider + store link */}
        <div className="px-6 py-5 border-t border-amber-tan/10 shrink-0 space-y-3">
          <Link href="/" className="flex items-center gap-2 font-dm text-[11px] text-linen-cream/25 hover:text-amber-tan transition-colors tracking-widest uppercase">
            <span>←</span> Back to Store
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-tan flex items-center justify-center shrink-0">
              <span className="font-dm text-xs font-bold text-obsidian">
                {(user.user_metadata?.full_name ?? user.email ?? "AD").slice(0,2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-dm text-xs text-linen-cream font-medium truncate">{user.user_metadata?.full_name ?? "Admin"}</p>
              <p className="font-dm text-[10px] text-linen-cream/30 truncate">{user.email}</p>
            </div>
            <button onClick={() => { logout(); router.push("/auth"); }} className="ml-auto text-linen-cream/20 hover:text-red-400 transition-colors" aria-label="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-amber-tan/10 flex items-center justify-between px-6 bg-obsidian sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-linen-cream/40 hover:text-amber-tan transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen-cream/20 pointer-events-none" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, orders..." className="input-gold pl-9 pr-4 py-2 rounded-lg font-dm text-sm w-60" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" data-notif>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative text-linen-cream/35 hover:text-amber-tan transition-colors"
              >
                <Bell size={17} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-tan rounded-full flex items-center justify-center font-dm text-[9px] font-bold text-obsidian">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0D0B06] border border-amber-tan/15 shadow-2xl rounded-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-amber-tan/10 flex items-center justify-between">
                    <p className="font-dm text-xs text-linen-cream font-semibold">Notifications</p>
                    {pendingCount > 0 && (
                      <span className="font-dm text-[9px] text-amber-tan bg-amber-tan/10 px-2 py-0.5 rounded-full">
                        {pendingCount} pending
                      </span>
                    )}
                  </div>
                  {pendingCount > 0 ? (
                    <div className="p-3">
                      <div className="flex items-start gap-3 p-3 bg-amber-tan/5 border border-amber-tan/10 rounded-lg">
                        <ShoppingBag size={14} className="text-amber-tan shrink-0 mt-0.5" />
                        <div>
                          <p className="font-dm text-xs text-linen-cream">{pendingCount} order{pendingCount > 1 ? "s" : ""} awaiting processing</p>
                          <Link href="/admin/orders" onClick={() => setNotifOpen(false)}
                            className="font-dm text-[10px] text-amber-tan hover:underline mt-1 inline-block">
                            View orders →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="font-dm text-xs text-linen-cream/25 text-center py-6">No new notifications</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-tan flex items-center justify-center">
                <span className="font-dm text-xs font-bold text-obsidian">
                  {(user.user_metadata?.full_name ?? user.email ?? "A")[0].toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="font-dm text-xs text-linen-cream font-medium truncate max-w-[120px]">
                  {user.user_metadata?.full_name ?? user.email ?? "Admin"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-7">
            <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.35em] mb-1">VOXE Admin</p>
            <h1 className="font-dm text-3xl text-linen-cream">{pageTitle}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
