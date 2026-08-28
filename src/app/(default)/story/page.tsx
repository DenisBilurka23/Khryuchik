import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StoryPageView } from "@/components/story-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getStoryTimelineBooks } from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.story")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("storyPage.lead");

  return {
    title,
    description,
    alternates: {
      canonical: "/story",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/story" : `/${locale}/story`,
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

const DefaultStoryPage = async () => {
  const country = await getRequestCountry();
  const timelineBooks = await getStoryTimelineBooks(defaultLocale, country);

  return (
    <StoryPageView locale={defaultLocale} timelineBooks={timelineBooks} />
  );
};

export default DefaultStoryPage;
