import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DeliveryPageView } from "@/components/delivery-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.faq")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("deliveryPage.payment.short");

  return {
    title,
    description,
    alternates: {
      canonical: "/delivery",
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/delivery" : `/${locale}/delivery`,
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

const DefaultDeliveryPage = async () => {
  const country = await getRequestCountry();

  return <DeliveryPageView locale={defaultLocale} country={country} />;
};

export default DefaultDeliveryPage;
