import type { Locale } from "@/i18n/config";
import type { ProductPageLabels } from "@/i18n/types";
import type { LocalizedProductSummary } from "@/types/catalog";
import type { ProductDetails, ProductImage } from "@/types/product-details";

export type StoryProductCardViewModel = {
  href: string;
  title: string;
  emoji?: string;
  thumbnailBackgroundColor?: string;
};

export type RelatedProductCardViewModel = {
  id: string;
  href: string;
  title: string;
  emoji: string;
  thumbnailBackgroundColor: string;
  formattedPrice: string;
};

export type ProductGalleryProps = {
  images: ProductImage[];
};

export type ProductInfoProps = {
  locale: Locale;
  product: ProductDetails;
};

export type ProductTabsProps = {
  labels: ProductPageLabels["tabs"];
  product: ProductDetails;
};

export type StoryConnectionCardProps = {
  product: StoryProductCardViewModel;
  titleTemplate: string;
  description: string;
  actionLabel: string;
};

export type RelatedProductsProps = {
  title: string;
  relatedProducts: RelatedProductCardViewModel[];
};

export type ProductPageViewProps = {
  locale: Locale;
  product: ProductDetails;
  relatedProducts: LocalizedProductSummary[];
  storyProduct?: LocalizedProductSummary | null;
};