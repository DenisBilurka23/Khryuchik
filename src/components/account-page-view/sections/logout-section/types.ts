import type { AccountPageDictionary } from "@/i18n/types";

export type LogoutSectionProps = {
  dictionary: AccountPageDictionary;
  onSignOut: () => void;
};