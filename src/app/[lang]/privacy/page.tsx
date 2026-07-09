import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { PrivacyPageView } from "@/components/privacy-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { isActiveLocale } from "@/server/localization/localization.service";

type LocalizedPrivacyPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedPrivacyPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const [tStorefront, tPrivacy] = await Promise.all([
    getTranslations({ locale: lang, namespace: "storefront" }),
    getTranslations({ locale: lang, namespace: "storefront.privacyPage" }),
  ]);

  const title = `${tPrivacy("title")} | ${tStorefront("brand.title")}`;
  const description = tPrivacy("intro");

  return {
    title,
    description,
    alternates: {
      canonical: lang === defaultLocale ? "/privacy" : `/${lang}/privacy`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/privacy" : `/${locale}/privacy`,
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

const LocalizedPrivacyPage = async ({
  params,
}: LocalizedPrivacyPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  return <PrivacyPageView locale={lang} />;
};

export default LocalizedPrivacyPage;
