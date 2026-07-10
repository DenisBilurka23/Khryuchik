import "server-only";

import { randomBytes } from "crypto";

import type { Locale } from "@/i18n/config";
import { getMongoDb } from "@/server/db/mongodb";
import type { NewsletterSubscriberDocument } from "@/types/newsletter";

const NEWSLETTER_SUBSCRIBERS_COLLECTION_NAME = "newsletterSubscribers";

let newsletterIndexesPromise: Promise<void> | null = null;

const getNewsletterSubscribersCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<NewsletterSubscriberDocument>(
    NEWSLETTER_SUBSCRIBERS_COLLECTION_NAME,
  );

  if (!newsletterIndexesPromise) {
    newsletterIndexesPromise = Promise.all([
      collection.createIndex({ email: 1 }, { unique: true, name: "email_unique" }),
      collection.createIndex(
        { unsubscribeToken: 1 },
        { unique: true, name: "unsubscribeToken_unique" },
      ),
    ]).then(() => undefined);
  }

  await newsletterIndexesPromise;

  return collection;
};

export const addNewsletterSubscriber = async (email: string, locale: Locale) => {
  const collection = await getNewsletterSubscribersCollection();

  await collection.updateOne(
    { email },
    {
      $setOnInsert: {
        email,
        locale,
        unsubscribeToken: randomBytes(32).toString("hex"),
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
};

export const getAllNewsletterSubscribers = async () => {
  const collection = await getNewsletterSubscribersCollection();

  return collection.find({}, { projection: { _id: 0 } }).toArray();
};

export const isNewsletterSubscriberPresent = async (email: string) => {
  const collection = await getNewsletterSubscribersCollection();

  const existing = await collection.findOne(
    { email },
    { projection: { _id: 1 } },
  );

  return existing !== null;
};

export const removeNewsletterSubscriberByToken = async (token: string) => {
  const collection = await getNewsletterSubscribersCollection();

  const result = await collection.deleteOne({ unsubscribeToken: token });

  return result.deletedCount > 0;
};

export const removeNewsletterSubscriberByEmail = async (email: string) => {
  const collection = await getNewsletterSubscribersCollection();

  const result = await collection.deleteOne({ email });

  return result.deletedCount > 0;
};
