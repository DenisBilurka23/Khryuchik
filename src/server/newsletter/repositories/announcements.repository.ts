import "server-only";

import { MongoServerError } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";

type NewsletterAnnouncementDocument = {
  productId: string;
  announcedAt: Date;
};

const NEWSLETTER_ANNOUNCEMENTS_COLLECTION_NAME = "newsletterAnnouncements";
const DUPLICATE_KEY_ERROR_CODE = 11000;

let announcementIndexesPromise: Promise<void> | null = null;

const getNewsletterAnnouncementsCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<NewsletterAnnouncementDocument>(
    NEWSLETTER_ANNOUNCEMENTS_COLLECTION_NAME,
  );

  if (!announcementIndexesPromise) {
    announcementIndexesPromise = collection
      .createIndex({ productId: 1 }, { unique: true, name: "productId_unique" })
      .then(() => undefined);
  }

  await announcementIndexesPromise;

  return collection;
};

// Atomically records that a product has been announced. Returns true only on the
// first call for a given product (the insert succeeded); subsequent calls hit the
// unique index and return false, which keeps the announcement idempotent across
// repeated product saves.
export const markProductAnnouncedIfNew = async (productId: string) => {
  const collection = await getNewsletterAnnouncementsCollection();

  try {
    await collection.insertOne({ productId, announcedAt: new Date() });

    return true;
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      error.code === DUPLICATE_KEY_ERROR_CODE
    ) {
      return false;
    }

    throw error;
  }
};
