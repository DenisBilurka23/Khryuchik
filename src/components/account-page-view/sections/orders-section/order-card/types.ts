import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { ProductPreview } from "@/types/catalog";
import type { UserReviewSummary } from "@/types/reviews";

export type OrderCardProps = {
  order: AccountOrder;
  locale: Locale;
  timeZone: string;
  orderProducts: Record<string, ProductPreview>;
  productReviews: Record<string, UserReviewSummary>;
};
