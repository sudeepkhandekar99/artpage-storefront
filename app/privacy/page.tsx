import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Privacy"
        title="Privacy policy"
        description="Customer data, payment privacy, and account information policies will be added before launch."
      >
        <div className="premium-card rounded-[2rem] p-6 text-muted-foreground">
          Privacy policy placeholder.
        </div>
      </Section>
    </PageShell>
  );
}