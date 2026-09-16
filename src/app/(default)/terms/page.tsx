import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TermsPageView } from "@/components/terms-page-view";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";

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

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/terms",
    title,
    description,
  });
};

const DefaultTermsPage = () => <TermsPageView locale={defaultLocale} />;

export default DefaultTermsPage;
