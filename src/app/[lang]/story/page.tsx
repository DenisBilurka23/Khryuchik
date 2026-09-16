import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StoryPageView } from "@/components/story-page-view";
import { getStoryTimelineBooks } from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedStoryPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedStoryPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.story")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("storyPage.lead");

  return createStorefrontMetadata({
    locale: lang,
    path: "/story",
    title,
    description,
  });
};

const LocalizedStoryPage = async ({ params }: LocalizedStoryPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const country = await getRequestCountry();
  const timelineBooks = await getStoryTimelineBooks(lang, country);

  return (
    <StoryPageView
      locale={lang}
      country={country}
      timelineBooks={timelineBooks}
    />
  );
};

export default LocalizedStoryPage;
