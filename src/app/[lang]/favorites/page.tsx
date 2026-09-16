import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FavoritesPageView } from "@/components/favorites-page-view";
import { locales } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getShopCategories } from "@/server/catalog/services/categories.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { getLocalizedPath } from "@/utils";

type LocalizedFavoritesPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedFavoritesPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  return createStorefrontMetadata({
    locale: lang,
    path: "/favorites",
    title: `${tStorefront("favoritesPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("favoritesPage.lead"),
  });
};

const LocalizedFavoritesPage = async ({
  params,
}: LocalizedFavoritesPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

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
      loginHref={getLocalizedPath(
        lang,
        `/login?callbackUrl=${encodeURIComponent(getLocalizedPath(lang, "/favorites"))}`,
      )}
      registerHref={getLocalizedPath(lang, "/register")}
    />
  );
};

export default LocalizedFavoritesPage;
