import Link from "next/link";

import { PageShell } from "@/components/ui/PageShell";

type PolicySection = {
  title: string;
  text: string;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: PolicySection[];
};

export function PolicyPage({
  eyebrow,
  title,
  description,
  sections,
}: PolicyPageProps) {
  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            {eyebrow}
          </p>

          <h1 className="mt-3 font-display text-6xl font-bold leading-none">
            {title}
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="premium-card max-w-4xl rounded-[2rem] p-5 sm:p-8">
          <div className="grid gap-7">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-4xl font-bold leading-none">
                  {section.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-[#fff8fc] p-5">
            <p className="text-sm leading-7 text-muted-foreground">
              Questions before ordering? Please contact the artist before placing
              custom or time-sensitive orders.
            </p>

            <Link
              href="/contact"
              className="soft-motion mt-4 inline-flex rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              Contact Ranin Art
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}