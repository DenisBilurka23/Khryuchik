import type { Locale } from "@/i18n/config";
import type { ProductPageLabels, StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/utils";
import type { LocalizedProductSummary } from "@/types/catalog";
import type { ProductDetails, ProductImage } from "@/types/product-details";

export type RelatedProductCardViewModel = {
  id: string;
  href: string;
  title: string;
  emoji: string;
  bgColor: string;
  formattedPrice: string;
};

export type ProductGalleryProps = {
  images: ProductImage[];
};

export type ProductInfoProps = {
  locale: Locale;
  labels: ProductPageLabels;
  wishlistAriaLabel: string;
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
  labels: ProductPageLabels;
  relatedProducts: RelatedProductCardViewModel[];
};

export type ProductPageViewProps = {
  locale: Locale;
  country: CountryCode;
  dictionary: StorefrontDictionary;
  product: ProductDetails;
  relatedProducts: LocalizedProductSummary[];
};