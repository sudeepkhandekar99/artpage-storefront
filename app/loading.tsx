export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="premium-card rounded-[2rem] px-8 py-10 text-center">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-[#F9B2D7]" />
        <p className="mt-5 text-sm font-bold text-muted-foreground">
          Loading Ranin Art...
        </p>
      </div>
    </main>
  );
}