import type { Locale } from "@/i18n/config";

export type NewsletterFormProps = {
  locale: Locale;
  emailPlaceholder: string;
  buttonLabel: string;
  successMessage: string;
  invalidEmailMessage: string;
  unexpectedErrorMessage: string;
};
