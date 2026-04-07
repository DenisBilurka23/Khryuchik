import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FavoritesPageView } from "@/components/favorites-page-view";
import { getShopCategories } from "@/data/products";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getLocalizedPath } from "@/utils";

type LocalizedFavoritesPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedFavoritesPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(lang, country);

  return {
    title: `${dictionary.storefront.favoritesPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
    description: dictionary.storefront.favoritesPage.lead,
    alternates: {
      canonical: lang === defaultLocale ? "/favorites" : `/${lang}/favorites`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/favorites" : `/${locale}/favorites`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: `${dictionary.storefront.favoritesPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
      description: dictionary.storefront.favoritesPage.lead,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const LocalizedFavoritesPage = async ({ params }: LocalizedFavoritesPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const [dictionary, session, categories] = await Promise.all([
    getDictionary(lang, country),
    getServerAuthSession(),
    getShopCategories(lang),
  ]);

  return (
    <FavoritesPageView
      locale={lang}
      storefrontDictionary={dictionary.storefront}
      accountDictionary={dictionary.accountPage}
      categoryLabels={Object.fromEntries(
        categories.map((category) => [category.key, category.label]),
      )}
      isAuthenticated={Boolean(session?.user?.id)}
      shopHref={getLocalizedPath(lang, "/shop")}
      loginHref={getLocalizedPath(lang, `/login?callbackUrl=${encodeURIComponent(getLocalizedPath(lang, "/favorites"))}`)}
      registerHref={getLocalizedPath(lang, "/register")}
    />
  );
};

export default LocalizedFavoritesPage;