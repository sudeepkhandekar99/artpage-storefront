import { notFound } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  getProductBySlug,
  getProductImageUrl,
  type Product,
} from "@/lib/products";

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

  const imageUrl = getProductImageUrl(product as Product);

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
            <span className="font-display text-5xl font-bold">
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
            ${Number(product.price).toFixed(2)}
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
    </PageShell>
  );
}