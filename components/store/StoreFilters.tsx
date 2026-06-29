"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import type { CategorySummary, ProductFilters } from "@/lib/products/types";

type StoreFiltersProps = {
  categories: CategorySummary[];
  filters: ProductFilters;
};

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
  { label: "Category", value: "category" },
];

function cleanPrice(value: string) {
  return value.replace(/[^\d.]/g, "");
}

export function StoreFilters({ categories, filters }: StoreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [category, setCategory] = useState(filters.category || "all");
  const [q, setQ] = useState(filters.q || "");
  const [min, setMin] = useState(filters.min || "");
  const [max, setMax] = useState(filters.max || "");
  const [sort, setSort] = useState(filters.sort || "featured");

  const hasFilters = useMemo(() => {
    return Boolean(
      filters.q ||
        filters.min ||
        filters.max ||
        filters.category ||
        (filters.sort && filters.sort !== "featured")
    );
  }, [filters]);

  function applyFilters(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const params = new URLSearchParams();

    if (category && category !== "all") {
      params.set("category", category);
    }

    if (q.trim()) {
      params.set("q", q.trim());
    }

    if (min.trim()) {
      params.set("min", min.trim());
    }

    if (max.trim()) {
      params.set("max", max.trim());
    }

    if (sort && sort !== "featured") {
      params.set("sort", sort);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
    setDrawerOpen(false);
  }

  function clearFilters() {
    setCategory("all");
    setQ("");
    setMin("");
    setMax("");
    setSort("featured");

    router.push(pathname);
    setDrawerOpen(false);
  }

  const FilterContent = (
    <form onSubmit={applyFilters} className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-extrabold text-[#24171f]">
          Category
        </p>

        <div className="grid gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`rounded-full px-4 py-2.5 text-left text-sm font-extrabold transition ${
              category === "all"
                ? "bg-[#24171f] text-white"
                : "bg-white text-[#24171f] hover:bg-[#fff8fc]"
            }`}
          >
            All categories
          </button>

          {categories.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setCategory(item.name)}
              className={`flex items-center justify-between rounded-full px-4 py-2.5 text-left text-sm font-extrabold capitalize transition ${
                category === item.name
                  ? "bg-[#24171f] text-white"
                  : "bg-white text-[#24171f] hover:bg-[#fff8fc]"
              }`}
            >
              <span>{item.name}</span>
              <span className="text-xs opacity-70">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-extrabold text-[#24171f]">
          Search
        </label>

        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search..."
          className="mt-2 h-10 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#F9B2D7]"
        />
      </div>

      <div>
        <label className="text-xs font-extrabold text-[#24171f]">
          Price
        </label>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            value={min}
            onChange={(event) => setMin(cleanPrice(event.target.value))}
            type="text"
            inputMode="decimal"
            placeholder="Min"
            className="h-10 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#F9B2D7]"
          />

          <input
            value={max}
            onChange={(event) => setMax(cleanPrice(event.target.value))}
            type="text"
            inputMode="decimal"
            placeholder="Max"
            className="h-10 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#F9B2D7]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-extrabold text-[#24171f]">
          Sort
        </label>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="mt-2 h-10 w-full rounded-full border border-[#ead8e2] bg-white px-4 text-sm font-extrabold outline-none transition focus:border-[#F9B2D7]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="submit"
          className="soft-motion h-10 rounded-full bg-[#F9B2D7] px-4 text-xs font-extrabold text-[#24171f] shadow-sm hover:bg-[#f69cca]"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className={`h-10 rounded-full border border-[#ead8e2] bg-white px-4 text-xs font-extrabold text-[#24171f] transition hover:bg-[#fff8fc] ${
            hasFilters ? "" : "opacity-70"
          }`}
        >
          Clear
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="soft-motion inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#24171f] px-5 text-sm font-extrabold text-white shadow-sm"
        >
          <SlidersHorizontal size={17} />
          Filters and sort
        </button>
      </div>

      <aside className="premium-card sticky top-20 hidden h-fit rounded-[1.5rem] p-4 lg:block">
        <div className="mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
            Browse
          </p>

          <h2 className="mt-1 font-display text-3xl font-bold">
            Filters
          </h2>
        </div>

        {FilterContent}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-[#24171f]/35 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-[#fffaf7] p-5 shadow-[0_-20px_70px_rgba(36,23,31,0.18)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
                  Store
                </p>

                <h2 className="font-display text-4xl font-bold">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            {FilterContent}
          </div>
        </div>
      )}
    </>
  );
}