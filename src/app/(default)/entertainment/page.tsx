import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EntertainmentPageView } from "@/components/entertainment-page-view";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { defaultLocale, locales } from "@/i18n/config";
import { getEntertainmentItems } from "@/server/entertainment/services/entertainment.service";
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

  return {
    title,
    description,
    alternates: {
      canonical: "/entertainment",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale
            ? "/entertainment"
            : `/${locale}/entertainment`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title,
      description,
      siteName: tStorefront("brand.title"),
    },
  };
};

const DefaultEntertainmentPage = async ({
  searchParams,
}: DefaultEntertainmentPageProps) => {
  const { entertainment } = await searchParams;
  const selectedCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const items = await getEntertainmentItems(defaultLocale, selectedCategory);

  return (
    <EntertainmentPageView
      locale={defaultLocale}
      items={items}
      selectedCategory={selectedCategory}
    />
  );
};

export default DefaultEntertainmentPage;
