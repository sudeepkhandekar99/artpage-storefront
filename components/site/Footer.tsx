import Link from "next/link";

const footerLinks = [
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#ead8e2]/80 bg-white/55 px-4 py-10 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-4xl font-bold">Ranin Art</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Handmade art pieces, painted vinyls, canvases, bookmarks, and
            thoughtful custom creations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-muted-foreground transition hover:text-[#24171f]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-[#ead8e2]/70 pt-5 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ranin Art. All rights reserved.</p>
        <p>Secure checkout coming soon.</p>
      </div>
    </footer>
  );
}