"use client";

import Link from "next/link";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping", href: "/shipping" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ead8e2]/80 bg-[#fffaf7]/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[linear-gradient(135deg,#F9B2D7,#CFECF3,#DAF9DE)] shadow-sm" />
          <div>
            <p className="font-display text-2xl font-bold leading-none tracking-tight">
              Ranin Art
            </p>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:block">
              Handmade Store
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "soft-motion rounded-full px-4 py-2 text-sm font-bold",
                  active
                    ? "bg-white text-[#24171f] shadow-sm"
                    : "text-muted-foreground hover:bg-white/70 hover:text-[#24171f]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/account"
            className="soft-motion rounded-full border border-[#ead8e2] bg-white/70 p-2.5 text-[#24171f] hover:bg-white"
            aria-label="Account"
          >
            <User size={18} />
          </Link>

          <Link
            href="/cart"
            className="soft-motion flex items-center gap-2 rounded-full bg-[#F9B2D7] px-4 py-2.5 text-sm font-extrabold text-[#24171f] hover:bg-[#f5a4cd]"
          >
            <ShoppingBag size={18} />
            Cart
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="soft-motion rounded-full border border-[#ead8e2] bg-white/75 p-2.5 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 min-h-screen bg-black/35 md:hidden">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />

          <aside className="slide-up absolute right-0 top-0 h-full w-[82%] max-w-sm border-l border-[#ead8e2] bg-[#fffaf7] p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-bold"
              >
                Ranin Art
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#ead8e2] bg-white p-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="grid gap-2">
              {[...navLinks, { label: "Account", href: "/account" }].map(
                (link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-white/70 px-4 py-4 text-base font-extrabold text-[#24171f]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#F9B2D7] px-5 py-4 text-base font-extrabold text-[#24171f]"
            >
              <ShoppingBag size={18} />
              View Cart
            </Link>
          </aside>
        </div>
      )}
    </header>
  );
}