import { EmptyState } from "@/components/states/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

export default function NotFoundPage() {
  return (
    <PageShell>
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        actionHref="/"
        actionLabel="Back home"
      />
    </PageShell>
  );
}