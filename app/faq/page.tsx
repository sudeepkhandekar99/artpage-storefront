import { PageShell } from "@/components/ui/PageShell";
import { FAQSection } from "@/components/site/FAQSection";
import { TrustSection } from "@/components/site/TrustSection";

export const metadata = {
  title: "FAQ | Ranin Art",
  description:
    "Questions about handmade artwork, custom orders, shipping, returns, gift notes, and checkout.",
};

export default function FAQPage() {
  return (
    <PageShell className="py-0">
      <section className="pt-8">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Help
          </p>

          <h1 className="mt-3 font-display text-6xl font-bold leading-none">
            Frequently asked questions
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            Answers about handmade pieces, made-to-order timelines, custom
            requests, shipping, returns, and secure checkout.
          </p>
        </div>
      </section>

      <FAQSection />

      <TrustSection />
    </PageShell>
  );
}