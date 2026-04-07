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
}) => PATCH<UpdateAccountProfileResponse>("/api/account/profile", payload);