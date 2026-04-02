import type { ResetPasswordPageDictionary } from "@/i18n/types";

export type ResetPasswordPageViewProps = {
  dictionary: ResetPasswordPageDictionary;
  token: string;
  loginHref: string;
};