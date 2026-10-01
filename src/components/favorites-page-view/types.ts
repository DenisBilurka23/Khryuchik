import type { Locale } from "@/i18n/config";

export type FavoritesPageSkeletonProps = {
  locale: Locale;
};

export type FavoritesPageViewProps = {
  locale: Locale;
  categoryLabels: Record<string, string>;
  isAuthenticated: boolean;
  shopHref: string;
  loginHref: string;
  registerHref: string;
  embedded?: boolean;
};
