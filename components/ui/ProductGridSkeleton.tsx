export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.75rem] border border-[#ead8e2]/90 bg-white"
        >
          <div className="skeleton-shimmer aspect-square" />

          <div className="space-y-4 p-5 sm:p-6">
            <div className="skeleton-shimmer h-4 w-24 rounded-full" />
            <div className="skeleton-shimmer h-8 w-3/4 rounded-full" />
            <div className="skeleton-shimmer h-4 w-full rounded-full" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}