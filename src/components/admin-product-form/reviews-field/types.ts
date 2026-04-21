import type { ProductReview } from "@/types/product-details";

export type AdminReviewsFieldProps = {
  name: string;
  title?: string;
  helperText?: string;
  initialReviews: ProductReview[];
  authorLabel: string;
  reviewLabel: string;
  ratingLabel: string;
  dateLabel: string;
  addButtonLabel: string;
  removeButtonLabel: string;
};