import type { AuthPageDictionary } from "@/i18n/types";

export type AuthPageViewProps = {
  dictionary: AuthPageDictionary;
  callbackUrl: string;
  isGoogleEnabled: boolean;
  registerHref: string;
  forgotPasswordHref: string;
};