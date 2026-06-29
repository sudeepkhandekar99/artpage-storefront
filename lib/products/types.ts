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
  png_original_filename?: string | null;
  jpg_original_filename?: string | null;
  png_size_bytes?: number | null;
  jpg_size_bytes?: number | null;
  alt_text: string | null;
  status: string;
  featured: boolean;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string | null;

  // TODO future columns.
  slug?: string | null;
  short_description?: string | null;
  medium?: string | null;
  material?: string | null;
  is_original?: boolean | null;
  is_limited?: boolean | null;
  edition_number?: string | null;
  frame_included?: boolean | null;
  care_instructions?: string | null;
  shipping_note?: string | null;
  processing_time_days?: number | null;
  sold_out?: boolean | null;
  visibility?: string | null;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
  featured?: string;
};

export type CategorySummary = {
  name: string;
  count: number;
};

export type StoreProductsResult = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};