import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type { PasswordResetTokenDocument } from "@/types/users";

const PASSWORD_RESET_TOKENS_COLLECTION_NAME = "passwordResetTokens";

let passwordResetIndexesPromise: Promise<void> | null = null;

const getPasswordResetTokensCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<PasswordResetTokenDocument>(
    PASSWORD_RESET_TOKENS_COLLECTION_NAME,
  );

  if (!passwordResetIndexesPromise) {
    passwordResetIndexesPromise = Promise.all([
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

  await passwordResetIndexesPromise;

  return collection;
};

export const replacePasswordResetTokenForUser = async (
  userId: ObjectId,
  tokenHash: string,
  expiresAt: Date,
) => {
  const collection = await getPasswordResetTokensCollection();
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

export const findActivePasswordResetToken = async (tokenHash: string) => {
  const collection = await getPasswordResetTokensCollection();

  return collection.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
};

export const markPasswordResetTokenUsed = async (tokenId: ObjectId) => {
  const collection = await getPasswordResetTokensCollection();

  await collection.updateOne(
    { _id: tokenId },
    {
      $set: {
        usedAt: new Date(),
      },
    },
  );
};