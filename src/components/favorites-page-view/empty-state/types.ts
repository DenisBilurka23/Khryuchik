import type { FavoritesPageViewProps } from "../types";

export type FavoritesEmptyStateProps = {
  authState: boolean;
  authCopy: FavoritesPageViewProps["accountDictionary"];
  guestCopy: FavoritesPageViewProps["storefrontDictionary"]["favoritesPage"];
  shopHref: string;
};