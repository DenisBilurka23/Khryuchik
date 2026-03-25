import type { Locale } from "@/i18n/config";

import type {
  ProductImage,
  ProductOption,
  ProductReview,
} from "./product-details";

export type ProductType = "book" | "merch";

export type CategoryKey = string;

export type ProductCategory = CategoryKey;

export type ProductPlacement = "home-books" | "home-shop" | "shop";

export type ProductAvailability =
  | "in_stock"
  | "out_of_stock"
  | "preorder"
  | "made_to_order";

export type ProductStatus = {
  isActive: boolean;
  visibleInShop: boolean;
  visibleOnHome: boolean;
  visibleInSearch: boolean;
};

export type ProductMerchandising = {
  featured: boolean;
  sortOrder: number;
  placements: ProductPlacement[];
  flags: string[];
};

export type ProductInventory = {
  trackQuantity: boolean;
  quantity: number | null;
  allowBackorder: boolean;
  availability: ProductAvailability;
};

export type ProductClassification = {
  type: ProductType;
  category: ProductCategory;
};

export type CategoryTranslation = {
  label: string;
  description?: string;
};

export type CategoryDocument = {
  key: CategoryKey;
  isActive: boolean;
  visibleInShop: boolean;
  visibleInHomeTabs: boolean;
  sortOrder: number;
  translations: Partial<Record<Locale, CategoryTranslation>>;
};

export type LocalizedCategory = {
  key: CategoryKey;
  label: string;
  description?: string;
  sortOrder: number;
};

export type ProductTranslation = {
  slug: string;
  title: string;
  shortTitle?: string;
  shortDescription: string;
  price: number;
  currency: "BYN";
  emoji: string;
  bgColor?: string;
  lang?: string;
};

export type ProductDocument = {
  productId: string;
  classification: ProductClassification;
  status: ProductStatus;
  merchandising: ProductMerchandising;
  inventory: ProductInventory;
  translations: Record<Locale, ProductTranslation>;
};

export type LocalizedProductSummary = ProductTranslation & {
  id: string;
  type: ProductType;
  category: ProductCategory;
  searchIndex: string;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
  placements: ProductPlacement[];
  availability: ProductAvailability;
  trackQuantity: boolean;
  quantity: number | null;
  allowBackorder: boolean;
  merchandisingFlags: string[];
};

export type ProductDetailTranslation = {
  subtitle: string;
  oldPrice?: number;
  badge?: string;
  storyLabel?: string;
  storyTitle?: string;
  sku: string;
  description: string;
  images: ProductImage[];
  languages?: ProductOption[];
  formats?: ProductOption[];
  sizes?: ProductOption[];
  colors?: ProductOption[];
  specs: Array<{ label: string; value: string }>;
  delivery: string[];
  reviews: ProductReview[];
};

export type ProductDetailDocument = {
  productId: string;
  relatedProductIds: string[];
  translations: Record<Locale, ProductDetailTranslation>;
};