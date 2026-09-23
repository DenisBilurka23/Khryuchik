import "server-only";

import { getMongoDb } from "@/server/db/mongodb";

const COLLECTION = "rateLimits";

type RateLimitDocument = {
  key: string;
  count: number;
  resetAt: Date;
};

export type RateLimitCounter = {
  count: number;
  resetAt: Date;
};

let indexesPromise: Promise<void> | null = null;

const getCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<RateLimitDocument>(COLLECTION);

  if (!indexesPromise) {
    indexesPromise = Promise.all([
      collection.createIndex({ key: 1 }, { unique: true, name: "key_unique" }),
      collection.createIndex(
        { resetAt: 1 },
        { expireAfterSeconds: 0, name: "resetAt_ttl" },
      ),
    ])
      .then(() => undefined)
      .catch((error) => {
        indexesPromise = null;
        throw error;
      });
  }

  await indexesPromise;

  return collection;
};

export const deleteRateLimitCounter = async (key: string): Promise<void> => {
  const collection = await getCollection();

  await collection.deleteOne({ key });
};

export const incrementRateLimitCounter = async ({
  key,
  windowMs,
}: {
  key: string;
  windowMs: number;
}): Promise<RateLimitCounter> => {
  const collection = await getCollection();
  const now = new Date();
  const nextResetAt = new Date(now.getTime() + windowMs);

  const counter = await collection.findOneAndUpdate(
    { key },
    [
      {
        $set: {
          count: {
            $cond: [{ $gt: ["$resetAt", now] }, { $add: ["$count", 1] }, 1],
          },
          resetAt: {
            $cond: [{ $gt: ["$resetAt", now] }, "$resetAt", nextResetAt],
          },
        },
      },
    ],
    { upsert: true, returnDocument: "after" },
  );

  if (!counter) {
    return { count: 1, resetAt: nextResetAt };
  }

  return { count: counter.count, resetAt: counter.resetAt };
};
