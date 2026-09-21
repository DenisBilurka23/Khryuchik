import type { ProductType } from "@/types/catalog";
import type { UserReviewSummary } from "@/types/reviews";

import type { OrderItemThumbnailViewModel } from "../types";

export type OrderItemReviewProps = {
  productId: string;
  productSlug: string;
  productTitle: string;
  productType: ProductType | null;
  thumbnail: OrderItemThumbnailViewModel;
  orderNumber: string;
  details: string[];
  review: UserReviewSummary | null;
};
