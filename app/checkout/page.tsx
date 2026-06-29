import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <PageShell>
      <EmptyState
        title="Checkout coming soon"
        description="Guest checkout and Stripe Checkout will be added after cart functionality."
        actionHref="/store"
        actionLabel="Back to store"
      />
    </PageShell>
  );
}