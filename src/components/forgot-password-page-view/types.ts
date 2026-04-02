import type { Locale } from "@/i18n/config";
import type { ForgotPasswordPageDictionary } from "@/i18n/types";

export type ForgotPasswordPageViewProps = {
  dictionary: ForgotPasswordPageDictionary;
  locale: Locale;
  loginHref: string;
};