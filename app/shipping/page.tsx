import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Shipping",
};

export default function ShippingPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Shipping"
        title="Shipping policy"
        description="Shipping rules, processing times, local pickup, and delivery details will be finalized before launch."
      >
        <div className="premium-card rounded-[2rem] p-6 text-muted-foreground">
          Shipping policy placeholder.
        </div>
      </Section>
    </PageShell>
  );
}