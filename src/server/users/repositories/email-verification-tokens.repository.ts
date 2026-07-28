import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type { EmailVerificationTokenDocument } from "@/types/users";

const EMAIL_VERIFICATION_TOKENS_COLLECTION_NAME = "emailVerificationTokens";

let emailVerificationIndexesPromise: Promise<void> | null = null;

const getEmailVerificationTokensCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<EmailVerificationTokenDocument>(
    EMAIL_VERIFICATION_TOKENS_COLLECTION_NAME,
  );

  if (!emailVerificationIndexesPromise) {
    emailVerificationIndexesPromise = Promise.all([
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

  await emailVerificationIndexesPromise;

  return collection;
};

export const replaceEmailVerificationTokenForUser = async (
  userId: ObjectId,
  tokenHash: string,
  expiresAt: Date,
) => {
  const collection = await getEmailVerificationTokensCollection();
  const now = new Date();

  await collection.deleteMany({ userId });

  await collection.insertOne({
    userId,
    tokenHash,
    createdAt: now,
    expiresAt,
    usedAt: null,
  });
};

export const findActiveEmailVerificationToken = async (tokenHash: string) => {
  const collection = await getEmailVerificationTokensCollection();

  return collection.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
};

export const markEmailVerificationTokenUsed = async (tokenId: ObjectId) => {
  const collection = await getEmailVerificationTokensCollection();

  await collection.updateOne(
    { _id: tokenId },
    {
      $set: {
        usedAt: new Date(),
      },
    },
  );
};
