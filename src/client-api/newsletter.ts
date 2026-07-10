import { POST } from "@/client-api";
import type { Locale } from "@/i18n/config";
import type { NewsletterErrorCode } from "@/types/newsletter";

type ErrorResponse = {
  error?: NewsletterErrorCode;
};

export const subscribeToNewsletterClient = async (
  email: string,
  locale: Locale,
) => POST<ErrorResponse>("/api/newsletter/subscribe", { email, locale });

export const unsubscribeFromNewsletterClient = async (token: string) =>
  POST<ErrorResponse>("/api/newsletter/unsubscribe", { token });
