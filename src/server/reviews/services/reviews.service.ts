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
  findReviewsByUser,
  insertReview,
} from "@/server/reviews/repositories/reviews.repository";
import type { ProductReview } from "@/types/product-details";
import { getRequestTimeZone } from "@/server/country/request-country";
import { isReviewableOrder } from "@/utils";
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
      | "product_not_found"
      | "not_delivered"
      | "already_reviewed",
  ) {
    super(message);
    this.name = "ReviewValidationError";
  }
}

const MIN_RATING = 1;
const MAX_RATING = 5;
const MAX_TEXT_LENGTH = 2000;

const hasDeliveredProduct = async (
  userId: string,
  email: string | undefined,
  productId: string,
): Promise<boolean> => {
  const orders = await findOrdersForUser(userId, email, { limit: null });

  return orders.some(
    (order) =>
      isReviewableOrder(order) &&
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

  const details = await findProductDetailsByProductId(input.productId);

  if (!details) {
    throw new ReviewValidationError(
      `Product '${input.productId}' was not found`,
      "product_not_found",
    );
  }

  const delivered = await hasDeliveredProduct(
    input.userId,
    input.email,
    input.productId,
  );

  if (!delivered) {
    throw new ReviewValidationError(
      "This product has not been delivered to the user yet",
      "not_delivered",
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

const formatReviewDate = (iso: string, locale: Locale, timeZone: string) =>
  new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone,
  }).format(new Date(iso));

export const getApprovedReviewsForProduct = async (
  productId: string,
  locale: Locale,
): Promise<ProductReview[]> => {
  const [reviews, timeZone] = await Promise.all([
    findApprovedReviewsByProductId(productId),
    getRequestTimeZone(),
  ]);

  return reviews.map((review) => ({
    id: review.id,
    author: review.author,
    date: formatReviewDate(review.createdAt, locale, timeZone),
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

  const timeZone = await getRequestTimeZone();

  return {
    id: existing.id,
    author: existing.author,
    date: formatReviewDate(existing.createdAt, locale, timeZone),
    rating: existing.rating,
    text: existing.text,
    status: existing.status,
  };
};

export const getUserReviewsByProduct = async (
  userId: string | undefined,
  locale: Locale,
): Promise<Record<string, UserReviewSummary>> => {
  if (!userId) {
    return {};
  }

  const [reviews, timeZone] = await Promise.all([
    findReviewsByUser(userId),
    getRequestTimeZone(),
  ]);

  return Object.fromEntries(
    reviews.map((review) => [
      review.productId,
      {
        id: review.id,
        author: review.author,
        date: formatReviewDate(review.createdAt, locale, timeZone),
        rating: review.rating,
        text: review.text,
        status: review.status,
      },
    ]),
  );
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
