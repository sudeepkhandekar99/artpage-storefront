import Link from "next/link";
import { Mail, Palette, PackageCheck } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";
import { siteConfig } from "@/lib/site/config";

type ContactPageProps = {
  searchParams: Promise<{
    type?: string;
    product?: string;
  }>;
};

export const metadata = {
  title: "Contact | Ranin Art",
  description:
    "Contact Ranin Art for custom orders, product questions, shipping questions, and handmade artwork inquiries.",
};

function getSubject(type?: string, product?: string) {
  if (type === "custom") {
    return product
      ? `Custom version request for ${product}`
      : "Custom artwork request";
  }

  if (type === "inquiry") {
    return product ? `Question about ${product}` : "Product inquiry";
  }

  return "Ranin Art inquiry";
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const subject = getSubject(params.type, params.product);

  const mailtoHref = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    subject
  )}`;

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
              Contact
            </p>

            <h1 className="mt-3 font-display text-6xl font-bold leading-none">
              Talk to the artist.
            </h1>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Reach out before custom orders, time-sensitive gifts, shipping
              questions, or product-specific requests.
            </p>

            <a
              href={mailtoHref}
              className="soft-motion mt-7 inline-flex items-center gap-2 rounded-full bg-[#F9B2D7] px-6 py-3 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#f69cca]"
            >
              <Mail size={17} />
              Email Ranin Art
            </a>

            <p className="mt-4 text-sm font-bold text-muted-foreground">
              {siteConfig.contactEmail}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="premium-card rounded-[2rem] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F9B2D7]/65">
                <Palette size={20} />
              </div>

              <h2 className="font-display text-4xl font-bold leading-none">
                Custom orders
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Include the product name, size, color palette, theme, budget,
                deadline, and any reference ideas.
              </p>

              <Link
                href="/shipping-policy"
                className="mt-4 inline-block text-sm font-extrabold text-[#b9598c]"
              >
                Read shipping timeline
              </Link>
            </div>

            <div className="premium-card rounded-[2rem] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DAF9DE]">
                <PackageCheck size={20} />
              </div>

              <h2 className="font-display text-4xl font-bold leading-none">
                Order questions
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                For existing orders, include your order number and the email
                used at checkout.
              </p>

              <Link
                href="/faq"
                className="mt-4 inline-block text-sm font-extrabold text-[#b9598c]"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}