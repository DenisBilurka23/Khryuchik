import { PATCH } from "@/client-api";

type ErrorResponse = {
  error?: string;
};

type UpdateAccountProfileResponse = ErrorResponse & {
  ok?: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    authProviders: Array<"google" | "credentials">;
    image?: string | null;
  };
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