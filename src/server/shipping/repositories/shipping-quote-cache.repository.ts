import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { ShippingQuote } from "@/types/shipping";

const COLLECTION = "shippingQuoteCache";

type ShippingQuoteCacheDocument = {
  key: string;
  quote: ShippingQuote;
  expiresAt: Date;
};

let indexesPromise: Promise<void> | null = null;

const getCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<ShippingQuoteCacheDocument>(COLLECTION);

  if (!indexesPromise) {
    indexesPromise = Promise.all([
      collection.createIndex({ key: 1 }, { unique: true, name: "key_unique" }),
      collection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0, name: "expiresAt_ttl" },
      ),
    ]).then(() => undefined);
  }

  await indexesPromise;

  return collection;
};

export const findCachedShippingQuote = async (
  key: string,
): Promise<ShippingQuote | null> => {
  const collection = await getCollection();
  const cached = await collection.findOne(
    { key },
    { projection: { _id: 0, quote: 1, expiresAt: 1 } },
  );

  if (!cached || cached.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return cached.quote;
};

export const saveCachedShippingQuote = async (
  key: string,
  quote: ShippingQuote,
  ttlMs: number,
) => {
  const collection = await getCollection();

  await collection.updateOne(
    { key },
    { $set: { quote, expiresAt: new Date(Date.now() + ttlMs) } },
    { upsert: true },
  );
};
