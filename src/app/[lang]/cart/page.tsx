import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CartPageView } from "@/components/cart-page-view";
import { getRequestCountry } from "@/server/country/request-country";
import { getRegionCurrency } from "@/server/localization/localization.service";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { isShopClosed } from "@/server/shop/maintenance.service";

type LocalizedCartPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedCartPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({ locale: lang, namespace: "storefront" });

  return createStorefrontMetadata({
    locale: lang,
    path: "/cart",
    title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("cartPage.lead"),
  });
};

const LocalizedCartPage = async ({ params }: LocalizedCartPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const country = await getRequestCountry();
  const currency = await getRegionCurrency(country);

  return (
    <CartPageView
      locale={lang}
      country={country}
      currency={currency}
      isShopClosed={isShopClosed()}
    />
  );
};

export default LocalizedCartPage;