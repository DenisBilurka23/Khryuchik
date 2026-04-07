import type { Locale } from "@/i18n/config";

import { POST } from "@/client-api";

type ErrorResponse = {
  error?: string;
};

export const requestPasswordResetClient = async (
  email: string,
  locale: Locale,
) =>
  POST<ErrorResponse>("/api/auth/password-reset/request", {
    email,
    locale,
    origin: window.location.origin,
  });

export const registerUserClient = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => POST<ErrorResponse>("/api/auth/register", payload);

export const confirmPasswordResetClient = async (
  token: string,
  password: string,
) =>
  POST<ErrorResponse>("/api/auth/password-reset/confirm", { token, password });
