import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CheckoutPageView } from "@/components/checkout-page-view";
import type { CheckoutInitialCustomer } from "@/components/checkout-page-view/types";
import { defaultLocale, locales } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getRegionCurrency } from "@/server/localization/localization.service";
import { splitName } from "@/utils/account-page";

export const generateMetadata = async (): Promise<Metadata> => {
  const tStorefront = await getTranslations({
    locale: defaultLocale,
    namespace: "storefront",
  });

  return {
    title: `${tStorefront("checkoutPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("checkoutPage.lead"),
    alternates: {
      canonical: "/checkout",
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

const DefaultCheckoutPage = async () => {
  const [country, session] = await Promise.all([
    getRequestCountry(),
    getServerAuthSession(),
  ]);
  const currency = await getRegionCurrency(country);

  return (
    <CheckoutPageView
      locale={defaultLocale}
      country={country}
      currency={currency}
      initialCustomer={initialCustomerFromSession(session)}
      initialShippingAddresses={session?.user?.shippingAddresses ?? []}
      initialSelectedAddressId={session?.user?.selectedShippingAddressId ?? null}
    />
  );
};

export default DefaultCheckoutPage;
