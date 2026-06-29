import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <PageShell>
      <EmptyState
        title="Account dashboard coming soon"
        description="Profiles, saved addresses, and account settings will be added later."
        actionHref="/account/orders"
        actionLabel="Order history placeholder"
      />
    </PageShell>
  );
}