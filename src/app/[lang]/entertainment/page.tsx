import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EntertainmentPageView } from "@/components/entertainment-page-view";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { getEntertainmentView } from "@/server/entertainment/services/entertainment.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { isEntertainmentCategory } from "@/utils";

type LocalizedEntertainmentPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ entertainment?: string }>;
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

  await requireActiveLocale(lang);

  const selectedCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const entertainmentView = await getEntertainmentView(lang, selectedCategory);

  return (
    <EntertainmentPageView locale={lang} entertainment={entertainmentView} />
  );
};

export default LocalizedEntertainmentPage;
