import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageShell>
      <Section
        eyebrow="Contact"
        title="Request a custom piece"
        description="A contact form and custom order flow will be added later."
      >
        <div className="premium-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-base leading-8 text-muted-foreground">
            Soon, customers will be able to send custom art requests, gift
            ideas, and product questions directly from this page.
          </p>
        </div>
      </Section>
    </PageShell>
  );
}