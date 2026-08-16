import { PageShell } from "@/components/ui/PageShell";

export default function ProductLoading() {
  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-5">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="skeleton-shimmer min-h-[560px] rounded-[2rem]" />

          <div className="space-y-5">
            <div className="skeleton-shimmer h-4 w-28 rounded-full" />
            <div className="skeleton-shimmer h-16 w-full rounded-full" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
            <div className="skeleton-shimmer h-48 rounded-[2rem]" />
            <div className="skeleton-shimmer h-56 rounded-[2rem]" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}