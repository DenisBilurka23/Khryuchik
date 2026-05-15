import type {
  AccountFavoriteMock,
  AccountFavoriteSuggestionMock,
} from "@/data/account-page-mock";
import type { Locale } from "@/i18n/config";

export type FavoritesSectionProps = {
  locale: Locale;
  favorites: AccountFavoriteMock[];
  favoriteSuggestions: AccountFavoriteSuggestionMock[];
  favoriteCategories: string[];
  favoritesInStockCount: number;
  favoritesTotal: string;
};