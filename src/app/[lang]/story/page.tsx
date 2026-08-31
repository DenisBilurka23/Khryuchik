import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { StoryPageView } from "@/components/story-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getStoryTimelineBooks } from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedStoryPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedStoryPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.story")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("storyPage.lead");

  return {
    title,
    description,
    alternates: {
      canonical: lang === defaultLocale ? "/story" : `/${lang}/story`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/story" : `/${locale}/story`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title,
      description,
      siteName: tStorefront("brand.title"),
    },
  };
};

const LocalizedStoryPage = async ({ params }: LocalizedStoryPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

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
