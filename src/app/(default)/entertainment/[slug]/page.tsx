import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { EntertainmentItemPageView } from "@/components/entertainment-item-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getEntertainmentItem } from "@/server/entertainment/services/entertainment.service";

type DefaultEntertainmentItemPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({
  params,
}: DefaultEntertainmentItemPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const item = await getEntertainmentItem(defaultLocale, slug);

  if (!item) {
    return {};
  }

  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${item.title} | ${tStorefront("brand.title")}`;

  return {
    title,
    description: item.description,
    alternates: {
      canonical: `/entertainment/${slug}`,
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
      locale: defaultLocale,
      title,
      description: item.description,
      siteName: tStorefront("brand.title"),
      images: item.poster?.src ? [{ url: item.poster.src }] : undefined,
    },
  };
};

const DefaultEntertainmentItemPage = async ({
  params,
}: DefaultEntertainmentItemPageProps) => {
  const { slug } = await params;
  const item = await getEntertainmentItem(defaultLocale, slug);

  if (!item) {
    notFound();
  }

  return <EntertainmentItemPageView locale={defaultLocale} item={item} />;
};

export default DefaultEntertainmentItemPage;
