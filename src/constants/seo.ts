import type { MetadataRoute } from "next";

import type { ProductAvailability } from "@/types/catalog";

export type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export type SitemapStaticRoute = {
  path: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
};

export const SITEMAP_STATIC_ROUTES: readonly SitemapStaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/entertainment", changeFrequency: "weekly", priority: 0.8 },
  { path: "/story", changeFrequency: "monthly", priority: 0.6 },
  { path: "/delivery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contacts", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export const SITEMAP_PRODUCT_CHANGE_FREQUENCY: SitemapChangeFrequency =
  "weekly";

export const SITEMAP_PRODUCT_PRIORITY = 0.8;

export const SITEMAP_ENTERTAINMENT_CHANGE_FREQUENCY: SitemapChangeFrequency =
  "monthly";

export const SITEMAP_ENTERTAINMENT_PRIORITY = 0.7;

export const ROBOTS_DISALLOWED_STOREFRONT_PATHS: readonly string[] = [
  "/account",
  "/cart",
  "/checkout",
  "/downloads",
  "/favorites",
  "/forgot-password",
  "/login",
  "/register",
  "/reset-password",
  "/unsubscribe",
  "/verify-email",
];

export const ROBOTS_DISALLOWED_PATHS: readonly string[] = ["/admin", "/api"];

export const SCHEMA_AVAILABILITY: Record<ProductAvailability, string> = {
  in_stock: "https://schema.org/InStock",
  out_of_stock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
  made_to_order: "https://schema.org/MadeToOrder",
};
