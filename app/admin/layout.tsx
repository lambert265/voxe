"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  BarChart2, Zap, Settings, Menu, X, Bell, ChevronDown, Search, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

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
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Auth guard — redirect to auth if not admin
  useEffect(() => {
    if (mounted && (!user || !isAdmin)) {
      router.replace("/auth");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, user, isAdmin]);

  if (!mounted || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-tan/30 border-t-amber-tan rounded-full animate-spin mx-auto mb-4" />
          <p className="font-dm text-xs text-linen-cream/30 tracking-widest uppercase">Verifying access...</p>
        </div>
      </div>
    );
  }

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
            <span className="font-playfair text-2xl font-bold text-amber-tan" style={{ letterSpacing: "-1px" }}>VOXE</span>
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
            <button className="relative text-linen-cream/35 hover:text-amber-tan transition-colors">
              <Bell size={17} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-tan rounded-full" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-amber-tan flex items-center justify-center">
                <span className="font-dm text-xs font-bold text-obsidian">SA</span>
              </div>
              <ChevronDown size={12} className="text-linen-cream/25 group-hover:text-amber-tan transition-colors" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-7">
            <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.35em] mb-1">VOXE Admin</p>
            <h1 className="font-playfair text-3xl text-linen-cream">{pageTitle}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
