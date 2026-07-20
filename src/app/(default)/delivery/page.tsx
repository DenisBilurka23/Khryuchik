import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DeliveryPageView } from "@/components/delivery-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getActiveRegionCodes } from "@/server/localization/localization.service";

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
  const [country, availableCountries] = await Promise.all([
    getRequestCountry(),
    getActiveRegionCodes(),
  ]);

  return (
    <DeliveryPageView
      locale={defaultLocale}
      country={country}
      availableCountries={availableCountries}
    />
  );
};

export default DefaultDeliveryPage;
