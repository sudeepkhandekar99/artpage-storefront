import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <PageShell>
      <EmptyState
        title="Your cart is empty"
        description="Cart drawer, cart persistence, and checkout flow will be added in later sprints."
        actionHref="/store"
        actionLabel="Browse store"
      />
    </PageShell>
  );
}