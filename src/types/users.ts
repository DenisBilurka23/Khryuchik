import type { ObjectId } from "mongodb";

export type AuthProvider = "google" | "credentials";

export type UserDocument = {
  _id?: ObjectId;
  email: string;
  name: string;
  phone: string;
  image?: string | null;
  passwordHash?: string | null;
  authProviders: AuthProvider[];
  createdAt: Date;
  updatedAt: Date;
};

export type SafeAuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  authProviders: AuthProvider[];
  image?: string | null;
};

export type RegisterUserInput = {
  email: string;
  name: string;
  phone: string;
  password: string;
};

export type UpdateUserProfileInput = {
  email: string;
  name: string;
  phone: string;
};

export type PasswordResetTokenDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date | null;
};