import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { ReviewDocument, ReviewStatus } from "@/types/reviews";

const collectionName = "reviews";

let reviewsIndexesPromise: Promise<unknown> | null = null;

const getReviewsCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<ReviewDocument>(collectionName);

  if (!reviewsIndexesPromise) {
    reviewsIndexesPromise = Promise.all([
      collection.createIndex({ productId: 1, status: 1 }),
      collection.createIndex({ userId: 1, productId: 1 }),
      collection.createIndex({ createdAt: -1 }),
    ]).catch((error) => {
      reviewsIndexesPromise = null;
      throw error;
    });
  }

  return collection;
};

export const insertReview = async (
  review: ReviewDocument,
): Promise<ReviewDocument> => {
  const collection = await getReviewsCollection();

  await collection.insertOne(review);

  return review;
};

export const findReviewById = async (
  id: string,
): Promise<ReviewDocument | null> => {
  const collection = await getReviewsCollection();

  return collection.findOne({ id }, { projection: { _id: 0 } });
};

export const findReviewByUserAndProduct = async (
  userId: string,
  productId: string,
): Promise<ReviewDocument | null> => {
  const collection = await getReviewsCollection();

  return collection.findOne({ userId, productId }, { projection: { _id: 0 } });
};

export const findApprovedReviewsByProductId = async (
  productId: string,
): Promise<ReviewDocument[]> => {
  const collection = await getReviewsCollection();

  return collection
    .find({ productId, status: "approved" }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
};

export type FindReviewsOptions = {
  limit?: number;
};

export const findReviews = async (
  options: FindReviewsOptions = {},
): Promise<ReviewDocument[]> => {
  const collection = await getReviewsCollection();
  const { limit = 100 } = options;

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
};

export const updateReviewStatus = async (
  id: string,
  status: ReviewStatus,
): Promise<void> => {
  const collection = await getReviewsCollection();

  await collection.updateOne(
    { id },
    { $set: { status, updatedAt: new Date().toISOString() } },
  );
};

export const deleteReview = async (id: string): Promise<void> => {
  const collection = await getReviewsCollection();

  await collection.deleteOne({ id });
};
