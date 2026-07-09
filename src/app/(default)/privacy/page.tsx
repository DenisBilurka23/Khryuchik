import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PrivacyPageView } from "@/components/privacy-page-view";
import { defaultLocale, locales } from "@/i18n/config";

export const generateMetadata = async (): Promise<Metadata> => {
  const [tStorefront, tPrivacy] = await Promise.all([
    getTranslations({ locale: defaultLocale, namespace: "storefront" }),
    getTranslations({
      locale: defaultLocale,
      namespace: "storefront.privacyPage",
    }),
  ]);

  const title = `${tPrivacy("title")} | ${tStorefront("brand.title")}`;
  const description = tPrivacy("intro");

  return {
    title,
    description,
    alternates: {
      canonical: "/privacy",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/privacy" : `/${locale}/privacy`,
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

const DefaultPrivacyPage = () => <PrivacyPageView locale={defaultLocale} />;

export default DefaultPrivacyPage;
