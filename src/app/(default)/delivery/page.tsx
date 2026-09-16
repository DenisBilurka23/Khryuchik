import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DeliveryPageView } from "@/components/delivery-page-view";
import { defaultLocale } from "@/i18n/config";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { getRequestCountry } from "@/server/country/request-country";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.faq")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("deliveryPage.payment.short");

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/delivery",
    title,
    description,
  });
};

const DefaultDeliveryPage = async () => {
  const country = await getRequestCountry();

  return <DeliveryPageView locale={defaultLocale} country={country} />;
};

export default DefaultDeliveryPage;
