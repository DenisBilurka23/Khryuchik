import type { CountryCode, CurrencyCode } from "@/utils";

export type ProductImage = {
  id: string;
  emoji?: string;
  bgColor?: string;
  src?: string;
  alt?: string;
  objectKey?: string;
};

export type ProductFileAsset = {
  id: string;
  label: string;
  fileName: string;
  format: string;
  contentType?: string;
  sizeBytes?: number;
  objectKey: string;
  url?: string;
};

export type ProductOptionPriceDelta = Partial<Record<CountryCode, number>>;

export type ProductOption = {
  label: string;
  value: string;
  priceDelta?: ProductOptionPriceDelta;
};

export type ProductOptionGroups = {
  languages?: ProductOption[];
  formats?: ProductOption[];
  sizes?: ProductOption[];
  colors?: ProductOption[];
};

export type ProductReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
};

export type ProductDetails = {
  productId: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  currency: CurrencyCode;
  oldPrice?: number;
  badge?: string;
  storyLabel?: string;
  storyTitle?: string;
  storyProductId?: string;
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
  digitalAssets?: ProductFileAsset[];
  relatedIds: string[];
};
