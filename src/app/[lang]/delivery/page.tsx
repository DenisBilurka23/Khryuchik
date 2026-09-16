import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DeliveryPageView } from "@/components/delivery-page-view";
import { getRequestCountry } from "@/server/country/request-country";
import { createStorefrontMetadata } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedDeliveryPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedDeliveryPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.faq")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("deliveryPage.payment.short");

  return createStorefrontMetadata({
    locale: lang,
    path: "/delivery",
    title,
    description,
  });
};

const LocalizedDeliveryPage = async ({
  params,
}: LocalizedDeliveryPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const country = await getRequestCountry();

  return <DeliveryPageView locale={lang} country={country} />;
};

export default LocalizedDeliveryPage;
