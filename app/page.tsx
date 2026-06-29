export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff7fc] px-6 py-10 text-[#21151d]">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#b9598c]">
          Ranin Art Storefront
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
          Public storefront coming soon.
        </h1>

        <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-[#6d616b] sm:text-lg">
          This is the deployed storefront shell. Next sprints will add the
          homepage, store page, product pages, cart, checkout, user accounts,
          and order history.
        </p>

        <div className="mt-10 grid grid-cols-4 gap-3">
          <div className="h-14 w-14 rounded-2xl bg-[#F9B2D7]" />
          <div className="h-14 w-14 rounded-2xl bg-[#CFECF3]" />
          <div className="h-14 w-14 rounded-2xl bg-[#DAF9DE]" />
          <div className="h-14 w-14 rounded-2xl bg-[#F6FFDC]" />
        </div>
      </section>
    </main>
  );
}