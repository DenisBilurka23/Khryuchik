import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { FavoritesPageView } from "@/components/favorites-page-view";
import { getShopCategories } from "@/data/products";
import { defaultLocale, locales } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";
import { getServerAuthSession } from "@/server/auth/config";
import { getLocalizedPath } from "@/utils";

type LocalizedFavoritesPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedFavoritesPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({ locale: lang, namespace: "storefront" });

  return {
    title: `${tStorefront("favoritesPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("favoritesPage.lead"),
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
      title: `${tStorefront("favoritesPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
      description: tStorefront("favoritesPage.lead"),
      siteName: tStorefront("brand.title"),
    },
  };
};

const LocalizedFavoritesPage = async ({ params }: LocalizedFavoritesPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const [session, categories] = await Promise.all([
    getServerAuthSession(),
    getShopCategories(lang),
  ]);

  return (
    <FavoritesPageView
      locale={lang}
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