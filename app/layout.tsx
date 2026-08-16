import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { PageTransition } from "@/components/ui/PageTransition";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Ranin Art",
    template: "%s | Ranin Art",
  },
  description:
    "Handmade canvases, painted vinyls, bookmarks, and custom art pieces.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Ranin Art",
    description:
      "Handmade canvases, painted vinyls, bookmarks, and custom art pieces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <WishlistProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />

              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}