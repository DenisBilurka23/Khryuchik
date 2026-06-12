import type { ObjectId } from "mongodb";

export type AuthProvider = "google" | "credentials";

export enum UserOperationErrorReason {
  NotFound = "not_found",
  EmailTaken = "email_taken",
  EmailManagedByGoogle = "email_managed_by_google",
  MissingFields = "missing_fields",
  InvalidCountry = "invalid_country",
  AddressNotFound = "address_not_found",
  CannotDemoteSelf = "cannot_demote_self",
  CannotDeleteSelf = "cannot_delete_self",
  LastAdmin = "last_admin",
}

export type WishlistEntryDocument = {
  productId: string;
  addedAt: Date;
};

export type UserShippingAddress = {
  id: string;
  title: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
};

export type UserShippingAddressInput = Omit<UserShippingAddress, "id">;

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
  shippingAddresses?: UserShippingAddress[];
  selectedShippingAddressId?: string | null;
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
  shippingAddresses: UserShippingAddress[];
  selectedShippingAddressId: string | null;
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
  image?: string | null;
  avatarObjectKey?: string | null;
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