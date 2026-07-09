import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { TermsPageView } from "@/components/terms-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedTermsPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedTermsPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const [tStorefront, tTerms] = await Promise.all([
    getTranslations({ locale: lang, namespace: "storefront" }),
    getTranslations({ locale: lang, namespace: "storefront.termsPage" }),
  ]);

  const title = `${tTerms("title")} | ${tStorefront("brand.title")}`;
  const description = tTerms("intro");

  return {
    title,
    description,
    alternates: {
      canonical: lang === defaultLocale ? "/terms" : `/${lang}/terms`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/terms" : `/${locale}/terms`,
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

const LocalizedTermsPage = async ({ params }: LocalizedTermsPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return <TermsPageView locale={lang} />;
};

export default LocalizedTermsPage;
