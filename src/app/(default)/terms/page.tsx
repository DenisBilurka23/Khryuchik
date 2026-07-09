import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TermsPageView } from "@/components/terms-page-view";
import { defaultLocale, locales } from "@/i18n/config";

export const generateMetadata = async (): Promise<Metadata> => {
  const [tStorefront, tTerms] = await Promise.all([
    getTranslations({ locale: defaultLocale, namespace: "storefront" }),
    getTranslations({
      locale: defaultLocale,
      namespace: "storefront.termsPage",
    }),
  ]);

  const title = `${tTerms("title")} | ${tStorefront("brand.title")}`;
  const description = tTerms("intro");

  return {
    title,
    description,
    alternates: {
      canonical: "/terms",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/terms" : `/${locale}/terms`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: defaultLocale,
      title,
      description,
      siteName: tStorefront("brand.title"),
    },
  };
};

const DefaultTermsPage = () => <TermsPageView locale={defaultLocale} />;

export default DefaultTermsPage;
