import type { ReviewStatus } from "@/types/reviews";

export type AdminReviewStatusActionsProps = {
  reviewId: string;
  status: ReviewStatus;
};
