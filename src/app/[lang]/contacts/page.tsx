import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContactPageView } from "@/components/contact-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedContactPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedContactPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("contactPage.hero.eyebrow")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("contactPage.hero.lede");

  return {
    title,
    description,
    alternates: {
      canonical: lang === defaultLocale ? "/contacts" : `/${lang}/contacts`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/contacts" : `/${locale}/contacts`,
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

const LocalizedContactPage = async ({ params }: LocalizedContactPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const country = await getRequestCountry();

  return <ContactPageView locale={lang} country={country} />;
};

export default LocalizedContactPage;
