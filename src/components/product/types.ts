import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { ProductPageLabels } from "@/i18n/types";
import type { LocalizedProductSummary } from "@/types/catalog";
import type {
  ProductDetails,
  ProductImage,
  ProductReview,
} from "@/types/product-details";
import type { ReviewStatus, UserReviewSummary } from "@/types/reviews";

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
  ownedLanguages?: string[];
};

export type ReviewFormViewModel = {
  isAuthenticated: boolean;
  hasPurchased: boolean;
  existingStatus: ReviewStatus | null;
  productId: string;
  productSlug: string;
  loginHref: string;
  labels: ProductPageLabels["reviewForm"];
};

export type ProductTabsProps = {
  labels: ProductPageLabels["tabs"];
  product: ProductDetails;
  reviewForm: ReviewFormViewModel;
  ownPendingReview: ProductReview | null;
};

export type ReviewFormProps = ReviewFormViewModel;

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
  ownedLanguages?: string[];
  isAuthenticated: boolean;
  hasPurchased: boolean;
  userReview: UserReviewSummary | null;
};

export type TabItem = {
  label: string;
  render: () => ReactNode;
};

export type FormStatus = "idle" | "submitting" | "success";
