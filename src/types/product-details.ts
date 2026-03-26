import type { CurrencyCode } from "@/lib/countries";

export type ProductImage = {
  id: string;
  emoji: string;
  bgColor?: string;
};

export type ProductOption = {
  label: string;
  value: string;
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
  relatedIds: string[];
};
