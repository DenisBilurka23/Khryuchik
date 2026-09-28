import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactPageView } from "@/components/contact-page-view";
import { getRequestRegion } from "@/server/region/request-region";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedContactPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedContactPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("contactPage.hero.eyebrow")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("contactPage.hero.lede");

  return createStorefrontMetadata({
    locale: lang,
    path: "/contacts",
    title,
    description,
  });
};

const LocalizedContactPage = async ({ params }: LocalizedContactPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const region = await getRequestRegion();

  return <ContactPageView locale={lang} region={region} />;
};

export default LocalizedContactPage;
