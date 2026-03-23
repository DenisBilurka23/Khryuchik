import type { Locale } from "@/i18n/config";
import type { ProductPageLabels, StorefrontDictionary } from "@/i18n/types";
import type { ProductDetails, ProductImage } from "@/types/product-details";

export type ProductGalleryProps = {
  images: ProductImage[];
};

export type ProductInfoProps = {
  locale: Locale;
  labels: ProductPageLabels;
  product: ProductDetails;
};

export type ProductTabsProps = {
  labels: ProductPageLabels;
  product: ProductDetails;
};

export type StoryConnectionCardProps = {
  storyTitle?: string;
  description: string;
  buttonHref: string;
  labels: ProductPageLabels;
};

export type RelatedProductsProps = {
  dictionary: StorefrontDictionary;
  labels: ProductPageLabels;
  locale: Locale;
  relatedIds: string[];
};

export type ProductPageViewProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
  product: ProductDetails;
};