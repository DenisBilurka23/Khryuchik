import type { AdminPageDictionary } from "@/i18n/types";
import type { ProductReview } from "@/types/product-details";

export type AdminProductReviewsSectionProps = {
  dictionary: AdminPageDictionary["productForm"];
  initialReviews: ProductReview[];
};