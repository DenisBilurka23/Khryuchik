import { notFound } from "next/navigation";
import { Container } from "@mui/material";
import { AccountPageView } from "@/components/account-page-view";
import { getShopCategories } from "@/server/catalog/services/categories.service";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
  isActiveLocale,
} from "@/server/localization/localization.service";
import { requireAccountPageContext } from "@/server/auth/page-context";
import { getRequestCountry } from "@/server/country/request-country";
import { getUserPurchasedDownloads } from "@/server/downloads/downloads.service";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { toAccountOrder } from "@/utils";
import type { LocalizedAccountPageProps } from "@/types/auth-pages";

const LocalizedAccountPage = async ({ params }: LocalizedAccountPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const { user } = await requireAccountPageContext(
    `/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/account`)}`,
  );

  const [
    country,
    rawOrders,
    downloads,
    categories,
    availableLocales,
    availableCountries,
  ] = await Promise.all([
    getRequestCountry(),
    findOrdersForUser(user.id, user.email),
    getUserPurchasedDownloads(user.id, user.email),
    getShopCategories(lang),
    getActiveLocaleCodes(),
    getActiveRegionCodes(),
  ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, lang));

  return (
    <Container maxWidth="lg">
      <AccountPageView
        locale={lang}
        country={country}
        availableLocales={availableLocales}
        availableCountries={availableCountries}
        homeHref={lang === "en" ? "/" : `/${lang}`}
        favoriteCategoryLabels={Object.fromEntries(
          categories.map((category) => [category.key, category.label]),
        )}
        user={user}
        orders={orders}
        downloads={downloads}
      />
    </Container>
  );
};

export default LocalizedAccountPage;
