import type { Metadata } from "next";

import { FavoritesPageView } from "@/components/favorites-page-view";
import { getShopCategories } from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getLocalizedPath } from "@/utils";

export const generateMetadata = async (): Promise<Metadata> => {
  const country = await getRequestCountry();
  const dictionary = await getDictionary(defaultLocale, country);

  return {
    title: `${dictionary.storefront.favoritesPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
    description: dictionary.storefront.favoritesPage.lead,
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
      title: `${dictionary.storefront.favoritesPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
      description: dictionary.storefront.favoritesPage.lead,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const DefaultFavoritesPage = async () => {
  const country = await getRequestCountry();
  const [dictionary, session, categories] = await Promise.all([
    getDictionary(defaultLocale, country),
    getServerAuthSession(),
    getShopCategories(defaultLocale),
  ]);

  return (
    <FavoritesPageView
      locale={defaultLocale}
      storefrontDictionary={dictionary.storefront}
      accountDictionary={dictionary.accountPage}
      categoryLabels={Object.fromEntries(
        categories.map((category) => [category.key, category.label]),
      )}
      isAuthenticated={Boolean(session?.user?.id)}
      shopHref={getLocalizedPath(defaultLocale, "/shop")}
      loginHref={getLocalizedPath(defaultLocale, "/login?callbackUrl=%2Ffavorites")}
      registerHref={getLocalizedPath(defaultLocale, "/register")}
    />
  );
};

export default DefaultFavoritesPage;