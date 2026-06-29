import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "product-images";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  dimensions: string | null;
  category: string;
  sku: string | null;
  png_image_path: string | null;
  jpg_image_path: string | null;
  alt_text: string | null;
  status: string;
  featured: boolean;
  created_at: string;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function productHref(product: Product) {
  return `/store/${slugify(product.name)}--${product.id}`;
}

export function getProductIdFromSlug(slug: string) {
  const parts = slug.split("--");
  return parts[parts.length - 1];
}

export function getProductImageUrl(product: Product) {
  const path = product.jpg_image_path || product.png_image_path;

  if (!path) return null;

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

  return data.publicUrl;
}

export async function getFeaturedProducts(limit = 3) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Product[];
}

export async function getNewProducts(limit = 6) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Product[];
}

export async function getProducts(filters: ProductFilters = {}) {
  const q = filters.q?.trim();
  const category = filters.category?.trim();
  const sort = filters.sort || "featured";

  let query = supabaseAdmin.from("products").select("*").eq("status", "active");

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (filters.min) {
    query = query.gte("price", Number(filters.min));
  }

  if (filters.max) {
    query = query.lte("price", Number(filters.max));
  }

  if (sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const id = getProductIdFromSlug(slug);

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error) {
    return null;
  }

  return data as Product;
}

export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("category")
    .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  const unique = Array.from(
    new Set((data || []).map((item) => item.category).filter(Boolean))
  );

  return unique;
}