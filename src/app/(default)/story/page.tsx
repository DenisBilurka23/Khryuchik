import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StoryPageView } from "@/components/story-page-view";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { getStoryTimelineBooks } from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.story")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("storyPage.lead");

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/story",
    title,
    description,
  });
};

const DefaultStoryPage = async () => {
  const country = await getRequestCountry();
  const timelineBooks = await getStoryTimelineBooks(defaultLocale, country);

  return (
    <StoryPageView
      locale={defaultLocale}
      country={country}
      timelineBooks={timelineBooks}
    />
  );
};

export default DefaultStoryPage;
