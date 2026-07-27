import { POST } from "@/client-api";

export type SubmitReviewInput = {
  productId: string;
  productSlug: string;
  rating: number;
  text: string;
};

export type SubmitReviewResponse = {
  ok?: boolean;
  status?: string;
  error?: string;
};

export const submitReview = async (input: SubmitReviewInput) =>
  POST<SubmitReviewResponse>("/api/reviews", input);
