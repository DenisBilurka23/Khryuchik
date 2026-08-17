import { GET, PATCH, POST } from "@/client-api";

import type { Locale } from "@/i18n/config";
import type {
  UserShippingAddress,
  UserShippingAddressInput,
} from "@/types/users";

type ErrorResponse = {
  error?: string;
};

type NewsletterSubscriptionResponse = ErrorResponse & {
  subscribed?: boolean;
};

type AccountClientUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  authProviders: Array<"google" | "credentials">;
  image?: string | null;
  shippingAddresses: UserShippingAddress[];
  selectedShippingAddressId: string | null;
};

type UpdateAccountProfileResponse = ErrorResponse & {
  ok?: boolean;
  user?: AccountClientUser;
};

type UpdateAccountAddressesResponse = ErrorResponse & {
  ok?: boolean;
  user?: AccountClientUser;
  address?: UserShippingAddress;
};

export const updateAccountProfileClient = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: File | null;
  removeAvatar?: boolean;
}) => {
  const body = new FormData();

  body.set("firstName", payload.firstName);
  body.set("lastName", payload.lastName);
  body.set("email", payload.email);
  body.set("phone", payload.phone);
  body.set("removeAvatar", payload.removeAvatar ? "1" : "0");

  if (payload.avatar) {
    body.set("avatar", payload.avatar);
  }

  return PATCH<UpdateAccountProfileResponse>("/api/account/profile", body);
};

export const addAccountAddressClient = async (
  payload: UserShippingAddressInput,
) => POST<UpdateAccountAddressesResponse>("/api/account/addresses", payload);

export const selectAccountAddressClient = async (addressId: string) =>
  PATCH<UpdateAccountAddressesResponse>("/api/account/addresses", {
    addressId,
  });

export const changeAccountPasswordClient = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => POST<ErrorResponse>("/api/account/password", payload);

export const deleteAccountClient = async (payload: {
  currentPassword?: string;
}) => POST<ErrorResponse>("/api/account/delete", payload);

export const getAccountNewsletterStatusClient = async () =>
  GET<NewsletterSubscriptionResponse>("/api/account/newsletter");

export const setAccountNewsletterSubscriptionClient = async (
  subscribed: boolean,
  locale: Locale,
) =>
  PATCH<NewsletterSubscriptionResponse>("/api/account/newsletter", {
    subscribed,
    locale,
  });
