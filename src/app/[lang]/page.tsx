import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Storefront } from "@/components/storefront";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type LocalizedPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: lang === defaultLocale ? "/" : `/${lang}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/" : `/${locale}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const LocalizedHome = async ({ params }: LocalizedPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <Storefront locale={lang} dictionary={dictionary.storefront} />;
};

export default LocalizedHome;
