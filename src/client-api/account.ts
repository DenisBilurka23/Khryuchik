import { PATCH, POST } from "@/client-api";

import type { UserShippingAddress, UserShippingAddressInput } from "@/types/users";

type ErrorResponse = {
  error?: string;
};

type AccountClientUser = {
  id: string;
  email: string;
  name: string;
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
  name: string;
  email: string;
  phone: string;
  avatar?: File | null;
  removeAvatar?: boolean;
}) => {
  const body = new FormData();

  body.set("name", payload.name);
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
  PATCH<UpdateAccountAddressesResponse>("/api/account/addresses", { addressId });

export const changeAccountPasswordClient = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => POST<ErrorResponse>("/api/account/password", payload);