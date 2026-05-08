import type { ObjectId } from "mongodb";

export type AuthProvider = "google" | "credentials";

export enum UserOperationErrorReason {
  NotFound = "not_found",
  EmailTaken = "email_taken",
  EmailManagedByGoogle = "email_managed_by_google",
  CannotDemoteSelf = "cannot_demote_self",
  CannotDeleteSelf = "cannot_delete_self",
  LastAdmin = "last_admin",
}

export type WishlistEntryDocument = {
  productId: string;
  addedAt: Date;
};

export type UserDocument = {
  _id?: ObjectId;
  email: string;
  name: string;
  phone: string;
  isAdmin?: boolean;
  image?: string | null;
  avatarObjectKey?: string | null;
  passwordHash?: string | null;
  authProviders: AuthProvider[];
  wishlist?: WishlistEntryDocument[];
  createdAt: Date;
  updatedAt: Date;
};

export type SafeAuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  isAdmin: boolean;
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

export type UpdateAdminUserInput = UpdateUserProfileInput & {
  isAdmin: boolean;
  image?: string | null;
  avatarObjectKey?: string | null;
};

export type PasswordResetTokenDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date | null;
};