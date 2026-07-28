import type { Locale } from "@/i18n/config";

export type AuthPageViewProps = {
  callbackUrl: string;
  isGoogleEnabled: boolean;
  locale: Locale;
  registerHref: string;
  forgotPasswordHref: string;
};
