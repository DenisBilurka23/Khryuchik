import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FavoritesPageView } from "@/components/favorites-page-view";
import { defaultLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getShopCategories } from "@/server/catalog/services/categories.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { getLocalizedPath } from "@/utils";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/favorites",
    title: `${tStorefront("favoritesPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("favoritesPage.lead"),
  });
};

const DefaultFavoritesPage = async () => {
  const [session, categories] = await Promise.all([
    getServerAuthSession(),
    getShopCategories(defaultLocale),
  ]);

  return (
    <FavoritesPageView
      locale={defaultLocale}
      categoryLabels={Object.fromEntries(
        categories.map((category) => [category.key, category.label]),
      )}
      isAuthenticated={Boolean(session?.user?.id)}
      shopHref={getLocalizedPath(defaultLocale, "/shop")}
      loginHref={getLocalizedPath(
        defaultLocale,
        "/login?callbackUrl=%2Ffavorites",
      )}
      registerHref={getLocalizedPath(defaultLocale, "/register")}
    />
  );
};

export default DefaultFavoritesPage;
