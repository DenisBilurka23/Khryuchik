import type { Locale } from "@/i18n/config";
import type { CountryCode, CurrencyCode } from "@/utils";

import type {
  ProductFileAsset,
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
};

export type ProductMerchandising = {
  sortOrder: number;
};

export type ProductInventory = {
  quantity: number | null;
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
  title: string;
  shortTitle?: string;
  shortDescription: string;
  price: number;
  currency: CurrencyCode;
  emoji: string;
  thumbnailBackgroundColor?: string;
  lang?: string;
};

export type ProductCountryPricing = {
  price: number;
  currency: CurrencyCode;
  oldPrice?: number;
};

export type ProductDocument = {
  productId: string;
  slug: string;
  classification: ProductClassification;
  status: ProductStatus;
  merchandising: ProductMerchandising;
  inventory: ProductInventory;
  pricing: Partial<Record<CountryCode, ProductCountryPricing>>;
  translations: Record<Locale, ProductTranslation>;
};

export type LocalizedProductSummary = ProductTranslation & {
  id: string;
  slug: string;
  type: ProductType;
  category: ProductCategory;
  searchIndex: string;
  oldPrice?: number;
  isActive: boolean;
  sortOrder: number;
  availability: ProductAvailability;
  quantity: number | null;
};

export type ProductDetailTranslation = {
  subtitle: string;
  oldPrice?: number;
  badge?: string;
  storyLabel?: string;
  storyTitle?: string;
  description: string;
  images: ProductImage[];
  languages?: ProductOption[];
  formats?: ProductOption[];
  sizes?: ProductOption[];
  colors?: ProductOption[];
  specs: Array<{ label: string; value: string }>;
  delivery: string[];
  reviews: ProductReview[];
  digitalAssets?: ProductFileAsset[];
};

export type ProductDetailDocument = {
  productId: string;
  sku: string;
  storyProductId?: string;
  relatedProductIds: string[];
  translations: Record<Locale, ProductDetailTranslation>;
};