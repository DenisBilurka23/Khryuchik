import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PrivacyPageView } from "@/components/privacy-page-view";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";

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

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/privacy",
    title,
    description,
  });
};

const DefaultPrivacyPage = () => <PrivacyPageView locale={defaultLocale} />;

export default DefaultPrivacyPage;
