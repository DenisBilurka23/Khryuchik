import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TermsPageView } from "@/components/terms-page-view";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedTermsPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedTermsPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const [tStorefront, tTerms] = await Promise.all([
    getTranslations({ locale: lang, namespace: "storefront" }),
    getTranslations({ locale: lang, namespace: "storefront.termsPage" }),
  ]);

  const title = `${tTerms("title")} | ${tStorefront("brand.title")}`;
  const description = tTerms("intro");

  return createStorefrontMetadata({
    locale: lang,
    path: "/terms",
    title,
    description,
  });
};

const LocalizedTermsPage = async ({ params }: LocalizedTermsPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  return <TermsPageView locale={lang} />;
};

export default LocalizedTermsPage;
