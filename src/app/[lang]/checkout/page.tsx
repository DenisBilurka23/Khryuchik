import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { CheckoutPageView } from "@/components/checkout-page-view";
import type { CheckoutInitialCustomer } from "@/components/checkout-page-view/types";
import { defaultLocale, locales } from "@/i18n/config";
import {
  getRegionCurrency,
  isActiveLocale,
} from "@/server/localization/localization.service";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { splitName } from "@/utils/account-page";

type LocalizedCheckoutPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedCheckoutPageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  return {
    title: `${tStorefront("checkoutPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("checkoutPage.lead"),
    alternates: {
      canonical: lang === defaultLocale ? "/checkout" : `/${lang}/checkout`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          locale === defaultLocale ? "/checkout" : `/${locale}/checkout`,
        ]),
      ),
    },
  };
};

const initialCustomerFromSession = (
  session: Awaited<ReturnType<typeof getServerAuthSession>>,
): CheckoutInitialCustomer | undefined => {
  const user = session?.user;
  if (!user) return undefined;
  // The session carries one name string, so it is split once here rather than
  // anywhere downstream — the order itself stores the halves.
  const { firstName, lastName } = splitName(user.name);
  return {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: user.email ?? undefined,
    phone: user.phone || undefined,
  };
};

const LocalizedCheckoutPage = async ({ params }: LocalizedCheckoutPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const [country, session] = await Promise.all([
    getRequestCountry(),
    getServerAuthSession(),
  ]);
  const currency = await getRegionCurrency(country);

  return (
    <CheckoutPageView
      locale={lang}
      country={country}
      currency={currency}
      initialCustomer={initialCustomerFromSession(session)}
      initialShippingAddresses={session?.user?.shippingAddresses ?? []}
      initialSelectedAddressId={session?.user?.selectedShippingAddressId ?? null}
    />
  );
};

export default LocalizedCheckoutPage;
