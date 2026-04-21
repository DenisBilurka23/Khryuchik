import { AdminSectionCard } from "../../../admin-page-shared";
import { AdminReviewsField } from "../../reviews-field";
import type { AdminProductReviewsSectionProps } from "./types";

export const AdminProductReviewsSection = ({
  dictionary,
  initialReviews,
}: AdminProductReviewsSectionProps) => {
  return (
    <AdminSectionCard title={dictionary.reviewsSectionTitle}>
      <AdminReviewsField
        name="reviewsJson"
        initialReviews={initialReviews}
        authorLabel={dictionary.fields.reviewAuthor}
        reviewLabel={dictionary.fields.reviewText}
        ratingLabel={dictionary.fields.reviewRating}
        dateLabel={dictionary.fields.reviewDate}
        addButtonLabel={dictionary.buttons.addReview}
        removeButtonLabel={dictionary.buttons.removeItem}
      />
    </AdminSectionCard>
  );
};

export type { AdminProductReviewsSectionProps } from "./types";