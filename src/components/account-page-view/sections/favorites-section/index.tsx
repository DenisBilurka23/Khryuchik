import { FavoritesPageView } from "@/components/favorites-page-view";
import { getLocalizedPath } from "@/utils";

import type { FavoritesSectionProps } from "./types";

export const FavoritesSection = ({
  locale,
  categoryLabels,
}: FavoritesSectionProps) => {
  return (
    <FavoritesPageView
      locale={locale}
      categoryLabels={categoryLabels}
      isAuthenticated
      shopHref={getLocalizedPath(locale, "/shop")}
      loginHref={getLocalizedPath(locale, "/login")}
      registerHref={getLocalizedPath(locale, "/register")}
      embedded
    />
  );
};

export type { FavoritesSectionProps } from "./types";