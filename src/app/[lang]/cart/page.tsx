import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CartPageView } from "@/components/cart-page-view";
import { getRequestRegion } from "@/server/region/request-region";
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

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  return createStorefrontMetadata({
    locale: lang,
    path: "/cart",
    title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("cartPage.lead"),
    noindex: true,
  });
};

const LocalizedCartPage = async ({ params }: LocalizedCartPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const region = await getRequestRegion();
  const currency = await getRegionCurrency(region);

  return (
    <CartPageView
      locale={lang}
      region={region}
      currency={currency}
      isShopClosed={isShopClosed()}
    />
  );
};

export default LocalizedCartPage;
