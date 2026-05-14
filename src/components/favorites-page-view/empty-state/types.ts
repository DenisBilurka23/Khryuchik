import type { AccountPageDictionary, FavoritesPageLabels } from "@/i18n/types";

export type FavoritesEmptyStateProps = {
  authState: boolean;
  authCopy: AccountPageDictionary;
  guestCopy: FavoritesPageLabels;
  shopHref: string;
};