import type { Locale } from "@/i18n/config";

export type FavoritesHeroProps = {
  locale: Locale;
  authState: boolean;
  shopHref: string;
  loginHref: string;
  registerHref: string;
  onAddAllToCart: () => void;
  isAddAllDisabled: boolean;
};