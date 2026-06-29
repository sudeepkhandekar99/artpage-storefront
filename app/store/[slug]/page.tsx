import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductCard } from "@/components/products/ProductCard";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products/queries";
import {
  formatPrice,
  getProductImageUrl,
} from "@/lib/products/utils";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name || "Product",
    description: product?.description || "Handmade product by Ranin Art.",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 3);
  const imageUrl = getProductImageUrl(product);

  return (
    <PageShell>
      <section className="grid gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="premium-card flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] bg-white">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.alt_text || product.name}
              className="h-full w-full object-contain p-8"
            />
          ) : (
            <span className="font-display text-5xl font-bold capitalize">
              {product.category}
            </span>
          )}
        </div>

        <div className="premium-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            {product.category}
          </p>

          <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-extrabold">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-8 grid gap-3 text-sm font-bold text-muted-foreground sm:grid-cols-2">
            {product.dimensions && (
              <div className="rounded-2xl bg-white/75 p-4">
                Dimensions: {product.dimensions}
              </div>
            )}

            {product.sku && (
              <div className="rounded-2xl bg-white/75 p-4">
                SKU: {product.sku}
              </div>
            )}

            <div className="rounded-2xl bg-white/75 p-4">
              Availability: Made to order
            </div>

            <div className="rounded-2xl bg-white/75 p-4">
              Checkout: Coming soon
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/cart">Add to cart soon</ButtonLink>
            <ButtonLink href="/store" variant="secondary">
              Back to store
            </ButtonLink>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="pb-12 pt-8">
          <div className="mb-6">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
              Related
            </p>
            <h2 className="font-display text-4xl font-bold">
              More in {product.category}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}