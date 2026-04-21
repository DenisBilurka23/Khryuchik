import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  AuthProvider,
  RegisterUserInput,
  SafeAuthUser,
  UpdateUserProfileInput,
  UserDocument,
  WishlistEntryDocument,
} from "@/types/users";

const USERS_COLLECTION_NAME = "users";
const EMAIL_INDEX_NAME = "email_unique";

let usersIndexesPromise: Promise<void> | null = null;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sortWishlistEntries = (entries: WishlistEntryDocument[]) =>
  [...entries].sort(
    (left, right) => right.addedAt.getTime() - left.addedAt.getTime(),
  );

const getUsersCollection = async () => {
  const db = await getMongoDb();
  const collection = db.collection<UserDocument>(USERS_COLLECTION_NAME);

  if (!usersIndexesPromise) {
    usersIndexesPromise = collection
      .createIndex({ email: 1 }, { unique: true, name: EMAIL_INDEX_NAME })
      .then(() => undefined);
  }

  await usersIndexesPromise;

  return collection;
};

const toSafeAuthUser = (user: UserDocument): SafeAuthUser => ({
  id: (user._id ?? new ObjectId()).toString(),
  email: normalizeEmail(user.email),
  name: user.name,
  phone: user.phone,
  isAdmin: Boolean(user.isAdmin),
  authProviders: user.authProviders,
  image: user.image ?? null,
});

export const findUserByEmail = async (email: string) => {
  const collection = await getUsersCollection();

  return collection.findOne({ email: normalizeEmail(email) });
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
  const document: UserDocument = {
    email: normalizeEmail(input.email),
    name: input.name.trim(),
    phone: input.phone.trim(),
    isAdmin: false,
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
        email: normalizeEmail(input.email),
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
  email: normalizeEmail(user.email),
  isAdmin: Boolean(user.isAdmin),
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

export const createGoogleUser = async (input: {
  email: string;
  name?: string | null;
  image?: string | null;
}) => {
  const collection = await getUsersCollection();
  const now = new Date();
  const document: UserDocument = {
    email: normalizeEmail(input.email),
    name: input.name?.trim() || "",
    phone: "",
    isAdmin: false,
    image: input.image ?? null,
    passwordHash: null,
    authProviders: ["google"],
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(document);

  return toSafeAuthUser({ ...document, _id: result.insertedId });
};

export const addGoogleToExistingUser = async (
  userId: ObjectId,
  input: {
    email: string;
    name?: string | null;
    image?: string | null;
  },
) => {
  const collection = await getUsersCollection();
  const existingUser = await collection.findOne({ _id: userId });

  if (!existingUser) {
    throw new Error("Failed to load existing user");
  }

  const nextName = existingUser.name || input.name?.trim() || "";
  const nextImage = existingUser.image ?? input.image ?? null;

  await collection.updateOne(
    { _id: userId },
    {
      $set: {
        email: normalizeEmail(input.email),
        name: nextName,
        image: nextImage,
        updatedAt: new Date(),
      },
      $addToSet: {
        authProviders: "google" satisfies AuthProvider,
      },
    },
  );

  const updatedUser = await collection.findOne({ _id: userId });

  if (!updatedUser) {
    throw new Error("Failed to load updated user");
  }

  return toSafeAuthUser(updatedUser);
};

export const updateUserProfile = async (
  userId: ObjectId,
  input: UpdateUserProfileInput,
) => {
  const collection = await getUsersCollection();

  await collection.updateOne(
    { _id: userId },
    {
      $set: {
        email: normalizeEmail(input.email),
        name: input.name.trim(),
        phone: input.phone.trim(),
        updatedAt: new Date(),
      },
    },
  );

  const updatedUser = await collection.findOne({ _id: userId });

  if (!updatedUser) {
    throw new Error("Failed to load updated user");
  }

  return toSafeAuthUser(updatedUser);
};

export const findAllUsers = async (limit?: number) => {
  const collection = await getUsersCollection();
  const cursor = collection
    .find({}, { projection: { passwordHash: 0, wishlist: 0 } })
    .sort({ createdAt: -1, _id: -1 });

  if (typeof limit === "number" && limit > 0) {
    cursor.limit(limit);
  }

  return cursor.toArray();
};

export const countUsers = async () => {
  const collection = await getUsersCollection();

  return collection.countDocuments();
};

export const countAdminUsers = async () => {
  const collection = await getUsersCollection();

  return collection.countDocuments({ isAdmin: true });
};

export const setUserAdminByEmail = async (email: string, isAdmin: boolean) => {
  const collection = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);

  return await collection.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        isAdmin,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
};

export const getUserWishlist = async (userId: ObjectId) => {
  const collection = await getUsersCollection();
  const user = await collection.findOne(
    { _id: userId },
    { projection: { wishlist: 1 } },
  );

  return sortWishlistEntries(user?.wishlist ?? []);
};

export const setUserWishlist = async (
  userId: ObjectId,
  wishlist: WishlistEntryDocument[],
) => {
  const collection = await getUsersCollection();
  const nextWishlist = sortWishlistEntries(wishlist);

  await collection.updateOne(
    { _id: userId },
    {
      $set: {
        wishlist: nextWishlist,
        updatedAt: new Date(),
      },
    },
  );

  return nextWishlist;
};
