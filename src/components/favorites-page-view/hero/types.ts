import type { AccountPageDictionary, FavoritesPageLabels } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

export type FavoritesHeroProps = {
  locale: Locale;
  guestCopy: FavoritesPageLabels;
  authCopy: AccountPageDictionary;
  authState: boolean;
  countLabel: string;
  shopHref: string;
  loginHref: string;
  registerHref: string;
  onAddAllToCart: () => void;
  isAddAllDisabled: boolean;
};