import type {
  AccountFavoriteMock,
  AccountFavoriteSuggestionMock,
} from "@/data/account-page-mock";
import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary } from "@/i18n/types";

export type FavoritesSectionProps = {
  locale: Locale;
  dictionary: AccountPageDictionary;
  favorites: AccountFavoriteMock[];
  favoriteSuggestions: AccountFavoriteSuggestionMock[];
  favoriteCategories: string[];
  favoritesInStockCount: number;
  favoritesTotal: string;
};