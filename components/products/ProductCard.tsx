import Link from "next/link";
import {
  getProductImageUrl,
  productHref,
  type Product,
} from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);

  return (
    <Link
      href={productHref(product)}
      className="premium-card soft-motion group block overflow-hidden rounded-[1.5rem]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.alt_text || product.name}
            className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f8eff4] p-8 text-center">
            <span className="font-display text-3xl font-bold">
              {product.category}
            </span>
          </div>
        )}

        {product.featured && (
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#24171f] shadow-sm">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b9598c]">
              {product.category}
            </p>

            <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
              {product.name}
            </h3>
          </div>

          <p className="shrink-0 text-base font-extrabold">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>
        )}

        {product.dimensions && (
          <p className="mt-4 text-sm font-bold text-[#24171f]">
            {product.dimensions}
          </p>
        )}
      </div>
    </Link>
  );
}