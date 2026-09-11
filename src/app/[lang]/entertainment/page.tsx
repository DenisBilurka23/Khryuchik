import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EntertainmentPageView } from "@/components/entertainment-page-view";
import { DEFAULT_ENTERTAINMENT_CATEGORY } from "@/constants/entertainment";
import { defaultLocale, locales } from "@/i18n/config";
import { getEntertainmentItems } from "@/server/entertainment/services/entertainment.service";
import { isActiveLocale } from "@/server/localization/localization.service";
import { isEntertainmentCategory } from "@/utils";

type LocalizedEntertainmentPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ entertainment?: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedEntertainmentPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.entertainment")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("entertainmentPage.hero.lead");

  return {
    title,
    description,
    alternates: {
      canonical:
        lang === defaultLocale ? "/entertainment" : `/${lang}/entertainment`,
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
      locale: lang,
      title,
      description,
      siteName: tStorefront("brand.title"),
    },
  };
};

const LocalizedEntertainmentPage = async ({
  params,
  searchParams,
}: LocalizedEntertainmentPageProps) => {
  const { lang } = await params;
  const { entertainment } = await searchParams;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const selectedCategory = isEntertainmentCategory(entertainment)
    ? entertainment
    : DEFAULT_ENTERTAINMENT_CATEGORY;
  const items = await getEntertainmentItems(lang, selectedCategory);

  return (
    <EntertainmentPageView
      locale={lang}
      items={items}
      selectedCategory={selectedCategory}
    />
  );
};

export default LocalizedEntertainmentPage;
