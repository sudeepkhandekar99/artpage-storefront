import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <PageShell>
      <EmptyState
        title="Create account coming soon"
        description="Customers will be able to create profiles and view orders later."
        actionHref="/"
        actionLabel="Back home"
      />
    </PageShell>
  );
}