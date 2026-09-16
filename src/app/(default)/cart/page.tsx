import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CartPageView } from "@/components/cart-page-view";
import { defaultLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { getRegionCurrency } from "@/server/localization/localization.service";
import { isShopClosed } from "@/server/shop/maintenance.service";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  return createStorefrontMetadata({
    locale: defaultLocale,
    path: "/cart",
    title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("cartPage.lead"),
  });
};

const DefaultCartPage = async () => {
  const country = await getRequestCountry();
  const currency = await getRegionCurrency(country);

  return (
    <CartPageView
      locale={defaultLocale}
      country={country}
      currency={currency}
      isShopClosed={isShopClosed()}
    />
  );
};

export default DefaultCartPage;