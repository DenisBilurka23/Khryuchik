import type { Locale } from "@/i18n/config";

export enum NewsletterErrorCode {
  InvalidEmail = "invalid_email",
  UnexpectedError = "unexpected_error",
}

export type NewsletterSubscriberDocument = {
  email: string;
  locale: Locale;
  unsubscribeToken: string;
  createdAt: Date;
};
