"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, BookOpen, User } from "lucide-react";

const SocialIcon = ({ label, href, children }: { label: string; href: string; children: React.ReactNode }) => (
  <a
    href={href}
    aria-label={label}
    className="w-9 h-9 border border-white/12 flex items-center justify-center text-linen-cream/40 hover:border-amber-tan hover:text-amber-tan transition-colors duration-300"
  >
    {children}
  </a>
);

const footerLinks = {
  Shop: [
    { label: "Men's Clothing",   href: "/shop/men/clothing"   },
    { label: "Women's Clothing", href: "/shop/women/clothing" },
    { label: "Teens",            href: "/shop/teens"          },
    { label: "Kids",             href: "/shop/kids"           },
    { label: "New Arrivals",     href: "/shop?sort=newest"    },
    { label: "Lookbook",         href: "/lookbook"            },
  ],
  Help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Track Order", href: "/track-order" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About VOXE", href: "/about" },
    { label: "Sustainability", href: "/about" },
    { label: "Careers", href: "/contact" },
    { label: "Press", href: "/contact" },
    { label: "Affiliates", href: "/contact" },
  ],
};

const mobileNav = [
  { label: "Home",  href: "/",           icon: Home },
  { label: "Shop",  href: "/shop",       icon: ShoppingBag },
  { label: "Teens", href: "/shop/teens", icon: BookOpen },
  { label: "Kids",  href: "/shop/kids",  icon: User },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav pill */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-obsidian/90 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 shadow-xl shadow-black/40">
          {mobileNav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-full text-[10px] font-dm font-medium tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-amber-tan text-obsidian shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                    : "text-linen-cream/55 hover:text-linen-cream hover:bg-white/8"
                }`}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="bg-obsidian text-linen-cream pt-20 pb-8 px-6 mb-24 md:mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="font-playfair text-[1.8rem] font-bold text-amber-tan block mb-5"
                style={{ letterSpacing: "-1px" }}
              >
                VOXE
              </Link>
              <p className="font-dm text-linen-cream/38 text-sm leading-relaxed max-w-[220px] mb-7">
                Gender-inclusive fashion for every story. Clothing and footwear crafted with intention.
              </p>
              <div className="flex gap-3">
                <SocialIcon label="Instagram" href="#">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </SocialIcon>
                <SocialIcon label="Twitter / X" href="#">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </SocialIcon>
                <SocialIcon label="YouTube" href="#">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
                </SocialIcon>
                <SocialIcon label="TikTok" href="#">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
                </SocialIcon>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <p className="font-dm text-[10px] text-amber-tan uppercase tracking-[0.2em] mb-5 font-semibold">
                  {heading}
                </p>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="font-dm text-sm text-linen-cream/40 hover:text-linen-cream transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-dm text-[11px] text-linen-cream/25">
              © {new Date().getFullYear()} VOXE. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                <Link key={item} href="#" className="font-dm text-[11px] text-linen-cream/25 hover:text-linen-cream/55 transition-colors duration-200">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
