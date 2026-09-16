import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EntertainmentPageView } from "@/components/entertainment-page-view";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { getEntertainmentView } from "@/server/entertainment/services/entertainment.service";
import { isEntertainmentCategory } from "@/utils";

type DefaultEntertainmentPageProps = {
  searchParams: Promise<{ entertainment?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.entertainment")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("entertainmentPage.hero.lead");

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/entertainment",
    title,
    description,
  });
};

const DefaultEntertainmentPage = async ({
  searchParams,
}: DefaultEntertainmentPageProps) => {
  const { entertainment } = await searchParams;
  const selectedCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const entertainmentView = await getEntertainmentView(
    defaultLocale,
    selectedCategory,
  );

  return (
    <EntertainmentPageView
      locale={defaultLocale}
      entertainment={entertainmentView}
    />
  );
};

export default DefaultEntertainmentPage;
