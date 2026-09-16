import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactPageView } from "@/components/contact-page-view";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("contactPage.hero.eyebrow")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("contactPage.hero.lede");

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/contacts",
    title,
    description,
  });
};

const DefaultContactPage = async () => {
  const country = await getRequestCountry();

  return <ContactPageView locale={defaultLocale} country={country} />;
};

export default DefaultContactPage;
