import { supabasePublic } from "@/lib/supabase/public";
import type {
  CategorySummary,
  Product,
  ProductFilters,
  StoreProductsResult,
} from "./types";
import { getProductIdFromSlug } from "./utils";

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

function clean(value?: string) {
  return value?.trim() || "";
}

function escapeOrValue(value: string) {
  return value.replace(/[%_,]/g, "");
}

function applyProductFilters(query: any, filters: ProductFilters = {}) {
  const q = clean(filters.q);
  const category = clean(filters.category);
  const min = clean(filters.min);
  const max = clean(filters.max);
  const featured = clean(filters.featured);
  const sort = clean(filters.sort) || "featured";

  let nextQuery = query.eq("status", "active");

  if (q) {
    const safeQ = escapeOrValue(q);
    nextQuery = nextQuery.or(
      `name.ilike.%${safeQ}%,description.ilike.%${safeQ}%,category.ilike.%${safeQ}%`
    );
  }

  if (category && category !== "all") {
    nextQuery = nextQuery.eq("category", category);
  }

  if (featured === "true") {
    nextQuery = nextQuery.eq("featured", true);
  }

  if (min) {
    const minPrice = Number(min);
    if (!Number.isNaN(minPrice)) {
      nextQuery = nextQuery.gte("price", minPrice);
    }
  }

  if (max) {
    const maxPrice = Number(max);
    if (!Number.isNaN(maxPrice)) {
      nextQuery = nextQuery.lte("price", maxPrice);
    }
  }

  if (sort === "price-asc") {
    nextQuery = nextQuery
      .order("price", { ascending: true })
      .order("featured", { ascending: false });
  } else if (sort === "price-desc") {
    nextQuery = nextQuery
      .order("price", { ascending: false })
      .order("featured", { ascending: false });
  } else if (sort === "newest") {
    nextQuery = nextQuery.order("created_at", { ascending: false });
  } else if (sort === "category") {
    nextQuery = nextQuery
      .order("category", { ascending: true })
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
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

export async function getStoreProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 12
): Promise<StoreProductsResult> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const baseQuery = supabasePublic
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" });

  const query = applyProductFilters(baseQuery, filters).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch store products: ${error.message}`);
  }

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    products: (data || []) as Product[],
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
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

    counts.set(item.category, (counts.get(item.category) || 0) + 1);
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