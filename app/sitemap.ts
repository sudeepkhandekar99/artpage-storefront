import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site/config";
import { getStoreProducts } from "@/lib/products/queries";
import { productHref } from "@/lib/products/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/store",
    "/wishlist",
    "/faq",
    "/contact",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/store" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/store" ? 0.9 : 0.6,
  }));

  const productResult = await getStoreProducts(
    {
      sort: "featured",
    },
    1,
    500
  );

  const productRoutes: MetadataRoute.Sitemap = productResult.products.map(
    (product) => ({
      url: `${siteConfig.url}${productHref(product)}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...productRoutes];
}