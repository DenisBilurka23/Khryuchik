import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactPageView } from "@/components/contact-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("contactPage.hero.eyebrow")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("contactPage.hero.lede");

  return {
    title,
    description,
    alternates: {
      canonical: "/contacts",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/contacts" : `/${locale}/contacts`,
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

const DefaultContactPage = async () => {
  const country = await getRequestCountry();

  return <ContactPageView locale={defaultLocale} country={country} />;
};

export default DefaultContactPage;
