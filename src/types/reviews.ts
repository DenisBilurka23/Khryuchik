export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export type ReviewDocument = {
  id: string;
  productId: string;
  productSlug: string;
  userId: string;
  author: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateReviewInput = {
  userId: string;
  author: string;
  productId: string;
  productSlug: string;
  rating: number;
  text: string;
};

export type AdminReviewListItem = {
  id: string;
  productId: string;
  productSlug: string;
  author: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: string;
};
