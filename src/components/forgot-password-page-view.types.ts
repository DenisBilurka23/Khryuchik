import type { ForgotPasswordPageDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

export type ForgotPasswordPageViewProps = {
  dictionary: ForgotPasswordPageDictionary;
  locale: Locale;
  loginHref: string;
};