import type { Locale } from "@/i18n/config";

import { POST } from "@/client-api";

type ErrorResponse = {
  error?: string;
};

type RegisterResponse = ErrorResponse & {
  requiresVerification?: boolean;
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  locale: Locale;
}) => POST<RegisterResponse>("/api/auth/register", payload);

export const confirmPasswordResetClient = async (
  token: string,
  password: string,
) =>
  POST<ErrorResponse>("/api/auth/password-reset/confirm", { token, password });

export const verifyEmailClient = async (token: string, locale: Locale) =>
  POST<ErrorResponse>("/api/auth/verify-email", { token, locale });

export const resendEmailVerificationClient = async (
  email: string,
  locale: Locale,
) => POST<ErrorResponse>("/api/auth/verify-email/resend", { email, locale });
