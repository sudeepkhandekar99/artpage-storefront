import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Terms"
        title="Terms and conditions"
        description="Store terms, purchase rules, custom work conditions, and usage policies will be added before launch."
      >
        <div className="premium-card rounded-[2rem] p-6 text-muted-foreground">
          Terms placeholder.
        </div>
      </Section>
    </PageShell>
  );
}