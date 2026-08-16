import { PageShell } from "@/components/ui/PageShell";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";

export default function StoreLoading() {
  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-5">
        <div className="mb-8">
          <div className="skeleton-shimmer h-4 w-24 rounded-full" />
          <div className="skeleton-shimmer mt-4 h-14 w-72 rounded-full" />
          <div className="skeleton-shimmer mt-4 h-4 w-full max-w-xl rounded-full" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="premium-card hidden h-[420px] rounded-[1.5rem] lg:block" />
          <ProductGridSkeleton count={6} />
        </div>
      </section>
    </PageShell>
  );
}