import type { FavoritesPageViewProps } from "../types";

export type FavoritesHeroProps = {
  locale: FavoritesPageViewProps["locale"];
  guestCopy: FavoritesPageViewProps["storefrontDictionary"]["favoritesPage"];
  authCopy: FavoritesPageViewProps["accountDictionary"];
  authState: boolean;
  countLabel: string;
  shopHref: string;
  loginHref: string;
  registerHref: string;
  onAddAllToCart: () => void;
  isAddAllDisabled: boolean;
};