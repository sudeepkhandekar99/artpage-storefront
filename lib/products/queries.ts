import { supabasePublic } from "@/lib/supabase/public";
import type { CategorySummary, Product, ProductFilters } from "./types";
import { getProductIdFromSlug, normalizeCategory } from "./utils";

const PRODUCT_SELECT = `
  id,
  name,
  description,
  price,
  dimensions,
  category,
  sku,
  png_image_path,
  jpg_image_path,
  png_original_filename,
  jpg_original_filename,
  png_size_bytes,
  jpg_size_bytes,
  alt_text,
  status,
  featured,
  metadata,
  created_at,
  updated_at
`;

function applyProductFilters(
  query: ReturnType<typeof supabasePublic.from> extends infer T ? any : never,
  filters: ProductFilters
) {
  const q = filters.q?.trim();
  const category = filters.category?.trim();
  const sort = filters.sort || "featured";

  let nextQuery = query.eq("status", "active");

  if (q) {
    nextQuery = nextQuery.or(
      `name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`
    );
  }

  if (category && category !== "all") {
    nextQuery = nextQuery.eq("category", normalizeCategory(category));
  }

  if (filters.min) {
    const min = Number(filters.min);
    if (!Number.isNaN(min)) {
      nextQuery = nextQuery.gte("price", min);
    }
  }

  if (filters.max) {
    const max = Number(filters.max);
    if (!Number.isNaN(max)) {
      nextQuery = nextQuery.lte("price", max);
    }
  }

  if (sort === "price-asc") {
    nextQuery = nextQuery.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    nextQuery = nextQuery.order("price", { ascending: false });
  } else if (sort === "newest") {
    nextQuery = nextQuery.order("created_at", { ascending: false });
  } else {
    nextQuery = nextQuery
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
  }

  return nextQuery;
}

export async function getProducts(filters: ProductFilters = {}) {
  const baseQuery = supabasePublic.from("products").select(PRODUCT_SELECT);
  const query = applyProductFilters(baseQuery, filters);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data || []) as Product[];
}

export async function getFeaturedProducts(limit = 3) {
  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch featured products: ${error.message}`);
  }

  return (data || []) as Product[];
}

export async function getNewProducts(limit = 6) {
  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch new products: ${error.message}`);
  }

  return (data || []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const id = getProductIdFromSlug(slug);

  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return null;
  }

  return data as Product;
}

export async function getCategories() {
  const { data, error } = await supabasePublic
    .from("products")
    .select("category")
    .eq("status", "active");

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const counts = new Map<string, number>();

  for (const item of data || []) {
    if (!item.category) continue;

    const category = item.category;
    counts.set(category, (counts.get(category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name)) as CategorySummary[];
}

export async function getRelatedProducts(product: Product, limit = 3) {
  const { data, error } = await supabasePublic
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("category", product.category)
    .neq("id", product.id)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch related products: ${error.message}`);
  }

  return (data || []) as Product[];
}