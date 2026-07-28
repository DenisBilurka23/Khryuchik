import type { Locale } from "@/i18n/config";

export type VerifyEmailPageViewProps = {
  token: string;
  locale: Locale;
  loginHref: string;
};
