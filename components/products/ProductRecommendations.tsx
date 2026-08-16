import type { Product } from "@/lib/products/types";
import { getFeaturedProducts, getStoreProducts } from "@/lib/products/queries";
import { ProductCard } from "@/components/products/ProductCard";

export async function ProductRecommendations({
  product,
}: {
  product: Product;
}) {
  const categoryResult = await getStoreProducts(
    {
      category: product.category,
      sort: "featured",
    },
    1,
    6
  );

  let recommendations = categoryResult.products.filter(
    (item) => item.id !== product.id
  );

  if (recommendations.length < 4) {
    const featured = await getFeaturedProducts(8);

    recommendations = [
      ...recommendations,
      ...featured.filter(
        (item) =>
          item.id !== product.id &&
          !recommendations.some((current) => current.id === item.id)
      ),
    ];
  }

  recommendations = recommendations.slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
          Recommended
        </p>

        <h2 className="mt-2 font-display text-5xl font-bold leading-none">
          You may also like
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}