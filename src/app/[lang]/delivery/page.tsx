import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { DeliveryPageView } from "@/components/delivery-page-view";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";

type LocalizedDeliveryPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
  params,
}: LocalizedDeliveryPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  const title = `${tStorefront("nav.faq")} | ${tStorefront("brand.title")}`;
  const description = tStorefront("deliveryPage.payment.short");

  return {
    title,
    description,
    alternates: {
      canonical: lang === defaultLocale ? "/delivery" : `/${lang}/delivery`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/delivery" : `/${locale}/delivery`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title,
      description,
      siteName: tStorefront("brand.title"),
    },
  };
};

const LocalizedDeliveryPage = async ({
  params,
}: LocalizedDeliveryPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();

  return <DeliveryPageView locale={lang} country={country} />;
};

export default LocalizedDeliveryPage;
