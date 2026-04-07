import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { AuthProvider } from "@/lib/auth";
import CartToast from "@/components/CartToast";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOXE — Wear Your Story",
  description: "Gender-inclusive fashion brand for clothing and shoes.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/icon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dm.variable}>
      <body suppressHydrationWarning>
        <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <CartToast />
          <ScrollToTop />
          </WishlistProvider>
        </CartProvider>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{ __html: `var _smartsupp = _smartsupp || {};_smartsupp.key = 'ea145b844873a3205b73a815040e510269980a9f';window.smartsupp||(function(d){var s,c,o=smartsupp=function(){o._.push(arguments)};o._=[];s=d.getElementsByTagName('script')[0];c=d.createElement('script');c.type='text/javascript';c.charset='utf-8';c.async=true;c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);})(document);` }} />
      </body>
    </html>
  );
}
