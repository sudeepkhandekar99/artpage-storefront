import Link from "next/link";
import { Search } from "lucide-react";

import { PageShell } from "@/components/ui/PageShell";
import { ProductCard } from "@/components/products/ProductCard";
import { StoreFilters } from "@/components/store/StoreFilters";
import { Pagination } from "@/components/store/Pagination";
import { getCategories, getStoreProducts } from "@/lib/products/queries";
import type { ProductFilters } from "@/lib/products/types";

export const metadata = {
  title: "Store | Ranin Art",
  description:
    "Browse handmade canvases, painted vinyls, bookmarks, and custom art.",
};

export const revalidate = 60;

type StorePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getFilters(
  params: Record<string, string | string[] | undefined>
): ProductFilters {
  return {
    q: getSingleParam(params, "q"),
    category: getSingleParam(params, "category"),
    sort: getSingleParam(params, "sort") || "featured",
    min: getSingleParam(params, "min"),
    max: getSingleParam(params, "max"),
    featured: getSingleParam(params, "featured"),
  };
}

function getPage(params: Record<string, string | string[] | undefined>) {
  const page = Number(getSingleParam(params, "page") || "1");

  if (Number.isNaN(page) || page < 1) {
    return 1;
  }

  return page;
}

function getFlatSearchParams(
  params: Record<string, string | string[] | undefined>
) {
  const flat: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(params)) {
    flat[key] = Array.isArray(value) ? value[0] : value;
  }

  return flat;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const filters = getFilters(params);
  const page = getPage(params);
  const flatParams = getFlatSearchParams(params);

  const [categories, result] = await Promise.all([
    getCategories(),
    getStoreProducts(filters, page, 12),
  ]);

  const activeFilterCount = [
    filters.q,
    filters.category,
    filters.min,
    filters.max,
    filters.featured,
    filters.sort && filters.sort !== "featured" ? filters.sort : undefined,
  ].filter(Boolean).length;

  return (
    <PageShell className="py-0">
      <section className="pb-12 pt-4 sm:pt-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
                Store
              </p>

              <span className="hidden h-px w-10 bg-[#ead8e2] sm:block" />
            </div>

            <h1 className="mt-2 font-display text-5xl font-bold leading-none sm:text-6xl">
              Browse art
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Explore handmade pieces by category, price, newest drops, and
              featured studio picks.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-full border border-[#ead8e2] bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-sm font-extrabold text-[#24171f]">
              {result.total} product{result.total === 1 ? "" : "s"}
            </p>

            <span className="h-4 w-px bg-[#ead8e2]" />

            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              {activeFilterCount > 0
                ? `${activeFilterCount} filter${
                    activeFilterCount === 1 ? "" : "s"
                  }`
                : "Featured first"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <StoreFilters categories={categories} filters={filters} />

          <div className="min-w-0">
            {result.products.length > 0 ? (
              <>
                <div className="grid gap-7 md:grid-cols-2">
                  {result.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  searchParams={flatParams}
                />
              </>
            ) : (
              <div className="premium-card flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9B2D7]/60">
                  <Search size={24} />
                </div>

                <h2 className="font-display text-5xl font-bold">
                  No pieces found
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  Try changing the category, clearing your price range, or
                  searching for something softer.
                </p>

                <Link
                  href="/store"
                  className="soft-motion mt-7 rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}