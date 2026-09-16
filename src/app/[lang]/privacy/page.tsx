import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PrivacyPageView } from "@/components/privacy-page-view";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedPrivacyPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedPrivacyPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const [tStorefront, tPrivacy] = await Promise.all([
    getTranslations({ locale: lang, namespace: "storefront" }),
    getTranslations({ locale: lang, namespace: "storefront.privacyPage" }),
  ]);

  const title = `${tPrivacy("title")} | ${tStorefront("brand.title")}`;
  const description = tPrivacy("intro");

  return createStorefrontMetadata({
    locale: lang,
    path: "/privacy",
    title,
    description,
  });
};

const LocalizedPrivacyPage = async ({
  params,
}: LocalizedPrivacyPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  return <PrivacyPageView locale={lang} />;
};

export default LocalizedPrivacyPage;
