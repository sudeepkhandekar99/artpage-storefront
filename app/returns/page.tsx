import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Returns",
};

export default function ReturnsPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Returns"
        title="Return policy"
        description="Return and exchange rules for handmade and custom products will be added here."
      >
        <div className="premium-card rounded-[2rem] p-6 text-muted-foreground">
          Return policy placeholder.
        </div>
      </Section>
    </PageShell>
  );
}