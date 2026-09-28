import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import {
  EntertainmentCatalog,
  EntertainmentCatalogSkeleton,
  EntertainmentPageView,
} from "@/components/entertainment-page-view";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { getEntertainmentView } from "@/server/entertainment/services/entertainment.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { isEntertainmentCategory } from "@/utils";
import type { Locale } from "@/i18n/config";
import type { EntertainmentCategoryKey } from "@/types/entertainment";

type LocalizedEntertainmentPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ entertainment?: string }>;
};

type EntertainmentCatalogDataProps = {
  locale: Locale;
  category: EntertainmentCategoryKey;
};

const EntertainmentCatalogData = async ({
  locale,
  category,
}: EntertainmentCatalogDataProps) => {
  const entertainment = await getEntertainmentView(locale, category);

  return <EntertainmentCatalog locale={locale} entertainment={entertainment} />;
};

export const generateMetadata = async ({
  params,
}: LocalizedEntertainmentPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.entertainment")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("entertainmentPage.hero.lead");

  return createStorefrontMetadata({
    locale: lang,
    path: "/entertainment",
    title,
    description,
  });
};

const LocalizedEntertainmentPage = async ({
  params,
  searchParams,
}: LocalizedEntertainmentPageProps) => {
  const { lang } = await params;
  const { entertainment } = await searchParams;

  const locale = await requireActiveLocale(lang);

  const selectedCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  return (
    <EntertainmentPageView locale={locale}>
      <Suspense fallback={<EntertainmentCatalogSkeleton />}>
        <EntertainmentCatalogData locale={locale} category={selectedCategory} />
      </Suspense>
    </EntertainmentPageView>
  );
};

export default LocalizedEntertainmentPage;
