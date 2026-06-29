import Link from "next/link";
import { ArrowLeft, Check, Package, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageShell } from "@/components/ui/PageShell";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductPurchaseBox } from "@/components/products/ProductPurchaseBox";
import { getProductBySlug, getRelatedProducts } from "@/lib/products/queries";
import {
  formatPrice,
  getProductImageUrl,
  getProductImageUrls,
} from "@/lib/products/utils";
import type { Product } from "@/lib/products/types";

export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function metaValue(product: Product, keys: string[], fallback = "Not specified") {
  for (const key of keys) {
    const value = product.metadata?.[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
  }

  return fallback;
}

function metaBoolean(product: Product, keys: string[]) {
  return keys.some((key) => {
    const value = product.metadata?.[key];
    return value === true || value === "true" || value === "yes";
  });
}

function getProductBadges(product: Product) {
  const badges: string[] = [];

  if (product.featured) badges.push("Featured");

  if (
    product.is_original ||
    metaBoolean(product, ["is_original", "original"])
  ) {
    badges.push("Original");
  } else {
    badges.push("Made to order");
  }

  if (
    product.is_limited ||
    product.edition_number ||
    metaBoolean(product, ["is_limited", "limited"])
  ) {
    badges.push("Limited");
  }

  if (
    product.sold_out ||
    product.status === "sold_out" ||
    metaBoolean(product, ["sold_out"])
  ) {
    badges.push("Sold out");
  }

  return badges;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[#ead8e2] bg-white/75 p-4">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#b9598c]">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-[#24171f]">
        {value}
      </p>
    </div>
  );
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[1.25rem] border border-[#ead8e2] bg-white/75 p-5"
    >
      <summary className="cursor-pointer list-none text-sm font-extrabold text-[#24171f]">
        <div className="flex items-center justify-between gap-4">
          <span>{title}</span>
          <span className="text-xl leading-none transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <div className="mt-4 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </details>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | Ranin Art",
    };
  }

  return {
    title: `${product.name} | Ranin Art`,
    description:
      product.description ||
      `Shop ${product.name}, a handmade ${product.category} by Ranin Art.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts] = await Promise.all([
    getRelatedProducts(product, 4),
  ]);

  const images = getProductImageUrls(product);
  const mainImage = getProductImageUrl(product);
  const badges = getProductBadges(product);

  const material =
    product.material ||
    metaValue(product, ["material", "materials"], "Hand-painted material");

  const medium =
    product.medium ||
    metaValue(product, ["medium", "surface_type"], product.category);

  const frameIncluded =
    product.frame_included === true ||
    metaBoolean(product, ["frame_included"])
      ? "Frame included"
      : metaValue(product, ["frame_info"], "Frame not included");

  const processingTime = product.processing_time_days
    ? `${product.processing_time_days} days`
    : metaValue(product, ["processing_time", "processing_time_days"], "Made to order timeline shared after purchase");

  const certificate = metaBoolean(product, ["certificate", "certificate_of_authenticity"])
    ? "Certificate included"
    : metaValue(
        product,
        ["certificate_note", "certificate_of_authenticity"],
        "Available on request"
      );

  const edition = product.edition_number
    ? product.edition_number
    : metaValue(product, ["edition_number", "edition"], "Open edition / one-off handmade piece");

  const careInstructions =
    product.care_instructions ||
    metaValue(
      product,
      ["care_instructions", "care"],
      "Keep away from direct moisture, wipe gently with a dry soft cloth, and avoid harsh cleaners."
    );

  const shippingNote =
    product.shipping_note ||
    metaValue(
      product,
      ["shipping_note", "shipping"],
      "Shipping options and timing will be confirmed during checkout."
    );

  const originalOrPrint =
    product.is_original || metaBoolean(product, ["is_original", "original"])
      ? "Original artwork"
      : metaValue(product, ["original_or_print", "product_type"], "Made to order handmade piece");

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-5">
        <Link
          href="/store"
          className="soft-motion mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold shadow-sm hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back to store
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <ProductGallery
              images={images}
              alt={product.alt_text || product.name}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-[#ead8e2] bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#24171f] shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
                {product.category}
              </p>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl">
                  {product.name}
                </h1>

                <p className="shrink-0 text-3xl font-extrabold text-[#24171f]">
                  {formatPrice(product.price)}
                </p>
              </div>

              {product.description && (
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>

            <ProductPurchaseBox product={product} imageUrl={mainImage} />

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Dimensions"
                value={product.dimensions || "Custom sizing available"}
              />
              <DetailItem label="Medium" value={medium} />
              <DetailItem label="Material" value={material} />
              <DetailItem label="Type" value={originalOrPrint} />
              <DetailItem label="Frame" value={frameIncluded} />
              <DetailItem label="Edition" value={edition} />
              <DetailItem label="Certificate" value={certificate} />
              <DetailItem label="Processing" value={processingTime} />
            </div>

            <div className="grid gap-3">
              <AccordionItem title="Artwork details" defaultOpen>
                <div className="space-y-3">
                  <p>
                    This piece is handmade and may include natural variations in
                    brush texture, surface finish, and small details. These
                    variations are part of the character of the artwork.
                  </p>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>{originalOrPrint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>{material}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} />
                      <span>{certificate}</span>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Shipping and returns">
                <div className="space-y-3">
                  <p>{shippingNote}</p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#fff8fc] p-4">
                      <div className="mb-2 flex items-center gap-2 font-extrabold text-[#24171f]">
                        <Truck size={17} />
                        Shipping
                      </div>
                      <p>
                        Shipping cost and timeline will depend on the product
                        type, destination, and packaging needs.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fff8fc] p-4">
                      <div className="mb-2 flex items-center gap-2 font-extrabold text-[#24171f]">
                        <Package size={17} />
                        Returns
                      </div>
                      <p>
                        Returns and exchanges depend on whether the item is
                        ready-made or custom. Custom work may be final sale.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Care instructions">
                <p>{careInstructions}</p>
              </AccordionItem>

              <AccordionItem title="Custom order note">
                <div className="space-y-3">
                  <p>
                    Want this piece in a different color palette, size, or
                    format? Send a custom request and include the product name.
                  </p>

                  <ButtonLink href="/contact" variant="secondary">
                    Request custom version
                  </ButtonLink>
                </div>
              </AccordionItem>
            </div>

            <div className="premium-card rounded-[2rem] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DAF9DE]">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h3 className="font-display text-3xl font-bold leading-none">
                    Handmade with care
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Every product is handled as an artwork, not a mass-produced
                    item. Packaging and processing are planned around the piece.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="pb-20">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
              Related
            </p>
            <h2 className="mt-2 font-display text-5xl font-bold leading-none">
              You may also like
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}