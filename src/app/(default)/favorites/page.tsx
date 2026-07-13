import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FavoritesPageView } from "@/components/favorites-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getShopCategories } from "@/server/catalog/services/categories.service";
import { getServerAuthSession } from "@/server/auth/config";
import { getLocalizedPath } from "@/utils";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  return {
    title: `${tStorefront("favoritesPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("favoritesPage.lead"),
    alternates: {
      canonical: "/favorites",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/favorites" : `/${locale}/favorites`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title: `${tStorefront("favoritesPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
      description: tStorefront("favoritesPage.lead"),
      siteName: tStorefront("brand.title"),
    },
  };
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
