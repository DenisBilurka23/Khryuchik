import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary, StorefrontDictionary } from "@/i18n/types";

export type FavoritesPageViewProps = {
  locale: Locale;
  storefrontDictionary: StorefrontDictionary;
  accountDictionary: AccountPageDictionary;
  categoryLabels: Record<string, string>;
  isAuthenticated: boolean;
  shopHref: string;
  loginHref: string;
  registerHref: string;
};