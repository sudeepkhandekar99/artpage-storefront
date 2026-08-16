import { PageShell } from "@/components/ui/PageShell";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";

export default function Loading() {
  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-8">
        <div className="mb-8">
          <div className="skeleton-shimmer h-4 w-28 rounded-full" />
          <div className="skeleton-shimmer mt-4 h-14 w-80 max-w-full rounded-full" />
          <div className="skeleton-shimmer mt-4 h-4 w-full max-w-xl rounded-full" />
        </div>

        <ProductGridSkeleton count={6} />
      </section>
    </PageShell>
  );
}