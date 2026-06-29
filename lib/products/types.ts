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
};

export type ProductFilters = {
  q?: string;
  category?: string;
  sort?: string;
  min?: string;
  max?: string;
};

export type CategorySummary = {
  name: string;
  count: number;
};