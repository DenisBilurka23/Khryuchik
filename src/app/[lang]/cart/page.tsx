import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CartPageView } from "@/components/cart-page-view";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRequestCountry } from "@/server/country/request-country";

type LocalizedCartPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedCartPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(lang, country);

  return {
    title: `${dictionary.storefront.cartPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
    description: dictionary.storefront.cartPage.lead,
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
      title: `${dictionary.storefront.cartPage.breadcrumbs.current} | ${dictionary.storefront.brand.title}`,
      description: dictionary.storefront.cartPage.lead,
      siteName: dictionary.storefront.brand.title,
    },
  };
};

const LocalizedCartPage = async ({ params }: LocalizedCartPageProps) => {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const country = await getRequestCountry();
  const dictionary = await getDictionary(lang, country);

  return (
    <CartPageView
      locale={lang}
      country={country}
      dictionary={dictionary.storefront}
    />
  );
};

export default LocalizedCartPage;