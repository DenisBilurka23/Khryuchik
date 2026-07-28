import "server-only";

import { randomUUID } from "node:crypto";

import type { Locale } from "@/i18n/config";
import { findProductDetailsByProductId } from "@/server/catalog/repositories/product-details.repository";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { notifyAdminNewReview } from "@/server/payments/telegram";
import {
  deleteReview,
  findApprovedReviewsByProductId,
  findReviewByUserAndProduct,
  findReviews,
  insertReview,
} from "@/server/reviews/repositories/reviews.repository";
import type { ProductReview } from "@/types/product-details";
import type {
  AdminReviewListItem,
  CreateReviewInput,
  ReviewDocument,
  UserReviewSummary,
} from "@/types/reviews";

export class ReviewValidationError extends Error {
  constructor(
    message: string,
    readonly code:
      | "invalid_rating"
      | "empty_text"
      | "product_not_found"
      | "not_purchased"
      | "already_reviewed",
  ) {
    super(message);
    this.name = "ReviewValidationError";
  }
}

const MIN_RATING = 1;
const MAX_RATING = 5;
const MAX_TEXT_LENGTH = 2000;

const hasPurchasedProduct = async (
  userId: string,
  email: string | undefined,
  productId: string,
): Promise<boolean> => {
  const orders = await findOrdersForUser(userId, email, { limit: null });

  return orders.some(
    (order) =>
      order.payment.status === "paid" &&
      order.items.some((item) => item.productId === productId),
  );
};

export const createReview = async (
  input: CreateReviewInput,
): Promise<ReviewDocument> => {
  const rating = Math.round(input.rating);

  if (!Number.isFinite(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    throw new ReviewValidationError(
      "Rating must be between 1 and 5",
      "invalid_rating",
    );
  }

  const text = input.text.trim();

  if (text.length === 0) {
    throw new ReviewValidationError("Review text is empty", "empty_text");
  }

  const details = await findProductDetailsByProductId(input.productId);

  if (!details) {
    throw new ReviewValidationError(
      `Product '${input.productId}' was not found`,
      "product_not_found",
    );
  }

  const purchased = await hasPurchasedProduct(
    input.userId,
    input.email,
    input.productId,
  );

  if (!purchased) {
    throw new ReviewValidationError(
      "User has not purchased this product",
      "not_purchased",
    );
  }

  const existing = await findReviewByUserAndProduct(
    input.userId,
    input.productId,
  );

  if (existing) {
    if (existing.status !== "rejected") {
      throw new ReviewValidationError(
        "User has already reviewed this product",
        "already_reviewed",
      );
    }

    await deleteReview(existing.id);
  }

  const now = new Date().toISOString();

  const review: ReviewDocument = {
    id: randomUUID(),
    productId: input.productId,
    productSlug: input.productSlug,
    userId: input.userId,
    author: input.author,
    rating,
    text: text.slice(0, MAX_TEXT_LENGTH),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const saved = await insertReview(review);
  void notifyAdminNewReview(saved);

  return saved;
};

const formatReviewDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

export const getApprovedReviewsForProduct = async (
  productId: string,
  locale: Locale,
): Promise<ProductReview[]> => {
  const reviews = await findApprovedReviewsByProductId(productId);

  return reviews.map((review) => ({
    id: review.id,
    author: review.author,
    date: formatReviewDate(review.createdAt, locale),
    rating: review.rating,
    text: review.text,
  }));
};

export const getUserReviewForProduct = async (
  userId: string | undefined,
  productId: string,
  locale: Locale,
): Promise<UserReviewSummary | null> => {
  if (!userId) {
    return null;
  }

  const existing = await findReviewByUserAndProduct(userId, productId);

  if (!existing) {
    return null;
  }

  return {
    id: existing.id,
    author: existing.author,
    date: formatReviewDate(existing.createdAt, locale),
    rating: existing.rating,
    text: existing.text,
    status: existing.status,
  };
};

export const getAdminReviews = async (): Promise<AdminReviewListItem[]> => {
  const reviews = await findReviews();

  return reviews.map((review) => ({
    id: review.id,
    productId: review.productId,
    productSlug: review.productSlug,
    author: review.author,
    rating: review.rating,
    text: review.text,
    status: review.status,
    createdAt: review.createdAt,
  }));
};
