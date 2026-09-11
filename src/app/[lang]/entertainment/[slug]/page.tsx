import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EntertainmentItemPageView } from "@/components/entertainment-item-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getEntertainmentItem } from "@/server/entertainment/services/entertainment.service";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedEntertainmentItemPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedEntertainmentItemPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const item = await getEntertainmentItem(lang, slug);

  if (!item) {
    return {};
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${item.title} | ${tStorefront("brand.title")}`;

  return {
    title,
    description: item.description,
    alternates: {
      canonical:
        lang === defaultLocale
          ? `/entertainment/${slug}`
          : `/${lang}/entertainment/${slug}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale
            ? `/entertainment/${slug}`
            : `/${locale}/entertainment/${slug}`,
        ]),
      ),
    },
    openGraph: {
      type: "video.other",
      locale: lang,
      title,
      description: item.description,
      siteName: tStorefront("brand.title"),
      images: item.poster?.src ? [{ url: item.poster.src }] : undefined,
    },
  };
};

const LocalizedEntertainmentItemPage = async ({
  params,
}: LocalizedEntertainmentItemPageProps) => {
  const { lang, slug } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const item = await getEntertainmentItem(lang, slug);

  if (!item) {
    notFound();
  }

  return <EntertainmentItemPageView locale={lang} item={item} />;
};

export default LocalizedEntertainmentItemPage;
