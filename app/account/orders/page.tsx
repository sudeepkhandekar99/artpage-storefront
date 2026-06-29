import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Order History",
};

export default function OrdersPage() {
  return (
    <PageShell>
      <EmptyState
        title="Order history coming soon"
        description="Paid orders will appear here after Stripe and accounts are connected."
        actionHref="/store"
        actionLabel="Browse store"
      />
    </PageShell>
  );
}