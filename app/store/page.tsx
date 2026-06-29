import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/states/EmptyState";
import { getCategories, getProducts } from "@/lib/products";

export const metadata = {
  title: "Store",
};

export const revalidate = 60;

type StorePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
  }>;
};

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const currentCategory = params.category || "all";
  const currentSort = params.sort || "featured";

  return (
    <PageShell>
      <Section
        eyebrow="Store"
        title="Browse the collection"
        description="Explore handmade canvases, painted vinyls, bookmarks, and custom-ready pieces."
        className="pt-4"
      >
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="premium-card h-fit rounded-[1.5rem] p-5">
            <h2 className="font-display text-3xl font-bold">Filters</h2>

            <form className="mt-5 grid gap-4">
              <div>
                <label className="text-sm font-bold">Search</label>
                <input
                  name="q"
                  defaultValue={params.q || ""}
                  placeholder="Search products"
                  className="mt-2 h-11 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold">Category</label>
                <select
                  name="category"
                  defaultValue={currentCategory}
                  className="mt-2 h-11 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm outline-none"
                >
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold">Sort</label>
                <select
                  name="sort"
                  defaultValue={currentSort}
                  className="mt-2 h-11 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm outline-none"
                >
                  <option value="featured">Featured first</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price low to high</option>
                  <option value="price-desc">Price high to low</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold">Min</label>
                  <input
                    name="min"
                    type="number"
                    defaultValue={params.min || ""}
                    className="mt-2 h-11 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold">Max</label>
                  <input
                    name="max"
                    type="number"
                    defaultValue={params.max || ""}
                    className="mt-2 h-11 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="soft-motion rounded-full bg-[#F9B2D7] px-5 py-3 text-sm font-extrabold"
              >
                Apply
              </button>

              <Link
                href="/store"
                className="text-center text-sm font-bold text-muted-foreground"
              >
                Clear filters
              </Link>
            </form>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-muted-foreground">
                Showing {products.length} product
                {products.length === 1 ? "" : "s"}
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No products found"
                description="Try clearing filters or adding active products from the admin dashboard."
                actionHref="/store"
                actionLabel="Clear filters"
              />
            )}
          </div>
        </div>
      </Section>
    </PageShell>
  );
}