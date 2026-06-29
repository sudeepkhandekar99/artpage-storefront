import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <PageShell>
      <EmptyState
        title="Customer login coming soon"
        description="Supabase Auth will be added after guest checkout is working."
        actionHref="/"
        actionLabel="Back home"
      />
    </PageShell>
  );
}