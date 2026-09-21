import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { ProductPreview } from "@/types/catalog";
import type { UserReviewSummary } from "@/types/reviews";

export type OrderItemThumbnailViewModel = {
  src?: string;
  alt: string;
  emoji: string;
  background?: string;
};

export type OrdersSectionProps = {
  locale: Locale;
  timeZone: string;
  orders: AccountOrder[];
  orderProducts: Record<string, ProductPreview>;
  productReviews: Record<string, UserReviewSummary>;
};
