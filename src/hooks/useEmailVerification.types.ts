import type { Locale } from "@/i18n/config";

export type EmailVerificationStatus =
  | "pending"
  | "success"
  | "invalid"
  | "error";

export type UseEmailVerificationInput = {
  token: string;
  locale: Locale;
};
