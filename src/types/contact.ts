import type { Locale } from "@/i18n/config";

export enum ContactErrorCode {
  InvalidName = "invalid_name",
  InvalidEmail = "invalid_email",
  InvalidMessage = "invalid_message",
  UnexpectedError = "unexpected_error",
}

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
  locale: Locale;
};
