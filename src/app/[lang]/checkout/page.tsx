import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CheckoutPageView } from "@/components/checkout-page-view";
import type { CheckoutInitialCustomer } from "@/components/checkout-page-view/types";
import { getRegionCurrency } from "@/server/localization/localization.service";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { isShopClosed } from "@/server/shop/maintenance.service";
import { ShopMaintenanceView } from "@/components/shop-maintenance-view";
import { locales } from "@/i18n/config";
import { createStorefrontAlternates } from "@/server/i18n/metadata";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";

type LocalizedCheckoutPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LocalizedCheckoutPageProps): Promise<Metadata> => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const tStorefront = await getTranslations({
    locale: lang,
    namespace: "storefront",
  });

  return {
    title: `${tStorefront("checkoutPage.breadcrumbs.current")} | ${tStorefront("brand.title")}`,
    description: tStorefront("checkoutPage.lead"),
    alternates: createStorefrontAlternates(lang, "/checkout"),
  };
};

const initialCustomerFromSession = (
  session: Awaited<ReturnType<typeof getServerAuthSession>>,
): CheckoutInitialCustomer | undefined => {
  const user = session?.user;
  if (!user) return undefined;
  return {
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    email: user.email ?? undefined,
    phone: user.phone || undefined,
  };
};

const LocalizedCheckoutPage = async ({ params }: LocalizedCheckoutPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  if (isShopClosed()) {
    return <ShopMaintenanceView />;
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
