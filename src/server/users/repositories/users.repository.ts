import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type { AuthProvider, RegisterUserInput, SafeAuthUser, UserDocument } from "@/types/users";

const USERS_COLLECTION_NAME = "users";

let usersIndexesPromise: Promise<void> | null = null;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getUsersCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<UserDocument>(USERS_COLLECTION_NAME);

  if (!usersIndexesPromise) {
    usersIndexesPromise = collection
      .createIndex({ emailNormalized: 1 }, { unique: true, name: "emailNormalized_unique" })
      .then(() => undefined);
  }

  await usersIndexesPromise;

  return collection;
};

const toSafeAuthUser = (user: UserDocument): SafeAuthUser => ({
  id: (user._id ?? new ObjectId()).toString(),
  email: user.email,
  name: user.name,
  phone: user.phone,
  image: user.image ?? null,
});

export const findUserByEmail = async (email: string) => {
  const collection = await getUsersCollection();

  return collection.findOne({ emailNormalized: normalizeEmail(email) });
};

export const findUserById = async (userId: ObjectId) => {
  const collection = await getUsersCollection();

  return collection.findOne({ _id: userId });
};

export const createCredentialsUser = async (
  input: RegisterUserInput & { passwordHash: string },
) => {
  const collection = await getUsersCollection();
  const now = new Date();
  const emailNormalized = normalizeEmail(input.email);
  const document: UserDocument = {
    email: input.email.trim(),
    emailNormalized,
    name: input.name.trim(),
    phone: input.phone.trim(),
    passwordHash: input.passwordHash,
    image: null,
    authProviders: ["credentials"],
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(document);

  return toSafeAuthUser({ ...document, _id: result.insertedId });
};

export const addCredentialsToExistingUser = async (
  userId: ObjectId,
  input: RegisterUserInput & { passwordHash: string },
) => {
  const collection = await getUsersCollection();
  const now = new Date();

  await collection.updateOne(
    { _id: userId },
    {
      $set: {
        name: input.name.trim(),
        phone: input.phone.trim(),
        passwordHash: input.passwordHash,
        updatedAt: now,
      },
      $addToSet: {
        authProviders: "credentials" satisfies AuthProvider,
      },
    },
  );

  const updatedUser = await collection.findOne({ _id: userId });

  if (!updatedUser) {
    throw new Error("Failed to load updated user");
  }

  return toSafeAuthUser(updatedUser);
};

export const toCredentialsAuthUser = (user: UserDocument) => ({
  id: (user._id ?? new ObjectId()).toString(),
  name: user.name,
  email: user.email,
  image: user.image ?? null,
});

export const setUserPasswordHash = async (
  userId: ObjectId,
  passwordHash: string,
) => {
  const collection = await getUsersCollection();

  await collection.updateOne(
    { _id: userId },
    {
      $set: {
        passwordHash,
        updatedAt: new Date(),
      },
      $addToSet: {
        authProviders: "credentials" satisfies AuthProvider,
      },
    },
  );
};