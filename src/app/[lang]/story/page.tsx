import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { StoryPageView } from "@/components/story-page-view";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

type LocalizedStoryPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedStoryPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
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

  if (!isLocale(lang)) {
    notFound();
  }

  return <StoryPageView locale={lang} />;
};

export default LocalizedStoryPage;
