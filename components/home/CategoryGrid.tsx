import Link from "next/link";
import type { CategorySummary, Product } from "@/lib/products/types";
import { getProductImageUrl, productHref } from "@/lib/products/utils";

type CategoryGridProps = {
  categories: CategorySummary[];
  products?: Product[];
};

const categoryMeta: Record<
  string,
  {
    title: string;
    label: string;
    description: string;
    gradient: string;
    accent: string;
  }
> = {
  canvas: {
    title: "Canvas",
    label: "Wall pieces",
    description: "Original painted works for walls, studios, and soft spaces.",
    gradient:
      "radial-gradient(circle at 20% 20%, rgba(249,178,215,0.65), transparent 35%), radial-gradient(circle at 80% 80%, rgba(246,255,220,0.6), transparent 38%), #fff",
    accent: "#F9B2D7",
  },
  vinyl: {
    title: "Vinyl",
    label: "Painted records",
    description: "Painted records for music lovers and creative interiors.",
    gradient:
      "radial-gradient(circle at 20% 25%, rgba(207,236,243,0.75), transparent 35%), radial-gradient(circle at 85% 75%, rgba(218,249,222,0.55), transparent 36%), #fff",
    accent: "#CFECF3",
  },
  bookmark: {
    title: "Bookmarks",
    label: "Reader gifts",
    description: "Small handmade pieces for readers, journals, and gifting.",
    gradient:
      "radial-gradient(circle at 18% 20%, rgba(218,249,222,0.78), transparent 34%), radial-gradient(circle at 85% 75%, rgba(249,178,215,0.35), transparent 36%), #fff",
    accent: "#DAF9DE",
  },
  bookmarks: {
    title: "Bookmarks",
    label: "Reader gifts",
    description: "Small handmade pieces for readers, journals, and gifting.",
    gradient:
      "radial-gradient(circle at 18% 20%, rgba(218,249,222,0.78), transparent 34%), radial-gradient(circle at 85% 75%, rgba(249,178,215,0.35), transparent 36%), #fff",
    accent: "#DAF9DE",
  },
};

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

function getCategoryProducts(products: Product[], categoryName: string) {
  const normalized = normalizeCategory(categoryName);

  return products
    .filter((product) => normalizeCategory(product.category) === normalized)
    .slice(0, 4);
}

function getMeta(categoryName: string, index: number) {
  const key = normalizeCategory(categoryName);

  const fallbackColors = ["#F9B2D7", "#CFECF3", "#DAF9DE", "#F6FFDC"];

  return (
    categoryMeta[key] || {
      title: categoryName,
      label: "Collection",
      description: `Explore available ${categoryName} pieces.`,
      gradient: `radial-gradient(circle at 22% 20%, ${
        fallbackColors[index % fallbackColors.length]
      }, transparent 35%), #fff`,
      accent: fallbackColors[index % fallbackColors.length],
    }
  );
}

export function CategoryGrid({ categories, products = [] }: CategoryGridProps) {
  const fallbackCategories: CategorySummary[] = [
    { name: "bookmark", count: 0 },
    { name: "canvas", count: 0 },
    { name: "vinyl", count: 0 },
  ];

  const categoriesToShow = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {categoriesToShow.map((category, index) => {
        const meta = getMeta(category.name, index);
        const previewProducts = getCategoryProducts(products, category.name);

        return (
          <Link
            key={category.name}
            href={`/store?category=${category.name}`}
            className="group relative min-h-[380px] overflow-hidden rounded-[2rem] border border-[#ead8e2]/90 bg-white shadow-[0_18px_60px_rgba(249,178,215,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(249,178,215,0.2)]"
          >
            <div
              className="absolute inset-0 opacity-90 transition duration-300 group-hover:scale-[1.03]"
              style={{ background: meta.gradient }}
            />

            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/85 to-transparent" />

            <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b9598c] shadow-sm">
                    {meta.label}
                  </span>

                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-[#6f606b] shadow-sm">
                    {category.count} item{category.count === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="relative h-40">
                  {previewProducts.length > 0 ? (
                    previewProducts.map((product, productIndex) => {
                      const imageUrl = getProductImageUrl(product);

                      if (!imageUrl) return null;

                      const positions = [
                        "left-[4%] top-4 h-24 w-24 rotate-[-8deg]",
                        "left-[38%] top-0 h-28 w-28 rotate-[6deg]",
                        "right-[4%] top-6 h-24 w-24 rotate-[10deg]",
                        "left-[24%] top-20 h-20 w-20 rotate-[-4deg]",
                      ];

                      return (
                        <div
                          key={product.id}
                          className={`absolute rounded-3xl transition duration-300 group-hover:scale-105 ${
                            positions[productIndex % positions.length]
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={product.alt_text || product.name}
                            className="h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(36,23,31,0.12)]"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className="h-24 w-24 rounded-[1.75rem] shadow-sm"
                      style={{ backgroundColor: meta.accent }}
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-display text-5xl font-bold leading-none text-[#24171f]">
                  {meta.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-muted-foreground">
                  {meta.description}
                </p>

                <div className="mt-6 inline-flex items-center rounded-full bg-[#24171f] px-4 py-2 text-sm font-extrabold text-white transition duration-300 group-hover:bg-[#F9B2D7] group-hover:text-[#24171f]">
                  Explore {meta.title}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}