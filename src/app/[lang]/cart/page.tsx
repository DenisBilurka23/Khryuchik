import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { CartPageView } from "@/components/cart-page-view";
import { defaultLocale, locales } from "@/i18n/config";
import {
  getRegionCurrency,
  isActiveLocale,
} from "@/server/localization/localization.service";
import { getRequestCountry } from "@/server/country/request-country";

type LocalizedCartPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedCartPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({ locale: lang, namespace: "storefront" });

  return {
    title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("cartPage.lead"),
    alternates: {
      canonical: lang === defaultLocale ? "/cart" : `/${lang}/cart`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/cart" : `/${locale}/cart`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      locale: lang,
      title: `${tStorefront("cartPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
      description: tStorefront("cartPage.lead"),
      siteName: tStorefront("brand.title"),
    },
  };
};

const LocalizedCartPage = async ({ params }: LocalizedCartPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const country = await getRequestCountry();
  const currency = await getRegionCurrency(country);

  return (
    <CartPageView locale={lang} country={country} currency={currency} />
  );
};

export default LocalizedCartPage;