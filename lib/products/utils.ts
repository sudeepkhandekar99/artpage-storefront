import type { Product } from "./types";

const DEFAULT_BUCKET = "product-images";

function getSupabaseStorageBaseUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return "";
  }

  return supabaseUrl.replace(/\/$/, "");
}

export function formatPrice(price: number | string | null | undefined) {
  const value = Number(price || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productHref(product: Product) {
  const slug = slugify(product.name || "product");

  return `/store/${slug}-${product.id}`;
}

export function getProductIdFromSlug(slug: string) {
  const uuidMatch = slug.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  );

  return uuidMatch ? uuidMatch[0] : slug;
}

export function getPublicImageUrl(path?: string | null) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = getSupabaseStorageBaseUrl();

  if (!baseUrl) return null;

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET || DEFAULT_BUCKET;

  const cleanPath = path.replace(/^\/+/, "");

  return `${baseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

export function getProductImageUrl(product: Product) {
  return (
    getPublicImageUrl(product.png_image_path) ||
    getPublicImageUrl(product.jpg_image_path)
  );
}

export function getProductImageUrls(product: Product) {
  const urls = [
    getPublicImageUrl(product.png_image_path),
    getPublicImageUrl(product.jpg_image_path),
  ].filter(Boolean) as string[];

  return Array.from(new Set(urls));
}