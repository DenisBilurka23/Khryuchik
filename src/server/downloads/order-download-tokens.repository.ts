import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type { OrderDownloadTokenDocument } from "@/types/download";

const ORDER_DOWNLOAD_TOKENS_COLLECTION_NAME = "orderDownloadTokens";

let orderDownloadTokenIndexesPromise: Promise<void> | null = null;

const getOrderDownloadTokensCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<OrderDownloadTokenDocument>(
    ORDER_DOWNLOAD_TOKENS_COLLECTION_NAME,
  );

  if (!orderDownloadTokenIndexesPromise) {
    orderDownloadTokenIndexesPromise = Promise.all([
      collection.createIndex(
        { tokenHash: 1 },
        { unique: true, name: "tokenHash_unique" },
      ),
      collection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0, name: "expiresAt_ttl" },
      ),
    ]).then(() => undefined);
  }

  await orderDownloadTokenIndexesPromise;

  return collection;
};

// An order may hold several live tokens at once: one travels in the
// confirmation email, another is minted for the checkout success page, and a
// re-sent email adds a third. Only the plaintext is a credential and it is
// never stored, so an unused row is harmless — the TTL index clears them.
export const insertOrderDownloadToken = async (
  orderId: string,
  tokenHash: string,
  expiresAt: Date,
) => {
  const collection = await getOrderDownloadTokensCollection();

  await collection.insertOne({
    orderId,
    tokenHash,
    createdAt: new Date(),
    expiresAt,
  });
};

export const findActiveOrderDownloadToken = async (tokenHash: string) => {
  const collection = await getOrderDownloadTokensCollection();

  return collection.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });
};
