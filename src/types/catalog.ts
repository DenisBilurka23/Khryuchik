import type { Locale } from "@/i18n/config";
import type { CountryCode, CurrencyCode } from "@/utils";

import type {
  ProductFileAsset,
  ProductImage,
  ProductOption,
  ProductReview,
} from "./product-details";
import type { ShippingHubCode } from "./shipping";

export type ProductType = "book" | "merch";

export type BookSeries = "small" | "travel";

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
  notifySubscribers: boolean;
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
  sortOrder: number;
};

export type ProductTranslation = {
  title: string;
  subtitle: string;
  price: number;
  currency: CurrencyCode;
  emoji: string;
  thumbnail?: ProductImage;
  thumbnailBackgroundColor?: string;
  lang?: string;
};

export type ProductCountryPricing = {
  price: number;
  currency: CurrencyCode;
  oldPrice?: number;
};

export type PrintifyVariantSelections = {
  size?: string;
  color?: string;
};

export type PrintifyVariantLink = {
  variantId: number;
  sku: string;
  title: string;
  selections: PrintifyVariantSelections;
  costCents: number;
  retailPriceCents: number;
  isEnabled: boolean;
  isAvailable: boolean;
};

export type ProductPrintifyLink = {
  shopId: string;
  printifyProductId: string;
  blueprintId: number;
  printProviderId: number;
  variants: PrintifyVariantLink[];
  syncedAt: string;
};

export type ProductHubStock = Partial<Record<ShippingHubCode, number>>;

export type ProductPrintedStock = Partial<Record<string, ProductHubStock>>;

export type ProductShipping = {
  weightGrams: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  hubs: ShippingHubCode[];
  stockByLanguage?: ProductPrintedStock;
  hsCode?: string;
};

export type ProductDocument = {
  productId: string;
  slug: string;
  classification: ProductClassification;
  status: ProductStatus;
  merchandising: ProductMerchandising;
  inventory: ProductInventory;
  ageRating?: string;
  showInStory?: boolean;
  series?: BookSeries;
  pricing: Partial<Record<CountryCode, ProductCountryPricing>>;
  availableRegions: string[];
  hasOptions?: boolean;
  printify?: ProductPrintifyLink;
  shipping?: ProductShipping;
  translations: Record<Locale, ProductTranslation>;
};

export type LocalizedProductSummary = ProductTranslation & {
  id: string;
  slug: string;
  type: ProductType;
  category: ProductCategory;
  searchIndex: string;
  ageRating?: string;
  series?: BookSeries;
  oldPrice?: number;
  isActive: boolean;
  sortOrder: number;
  availability: ProductAvailability;
  hasOptions: boolean;
  quantity: number | null;
};

export type ProductDetailTranslation = {
  oldPrice?: number;
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
