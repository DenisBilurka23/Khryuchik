import { Container } from "@mui/material";
import { AccountPageView } from "@/components/account-page-view";
import { defaultLocale } from "@/i18n/config";
import { getShopCategories } from "@/server/catalog/services/categories.service";
import { requireAccountPageContext } from "@/server/auth/page-context";
import { getRequestCountry } from "@/server/country/request-country";
import { getUserPurchasedDownloads } from "@/server/downloads/downloads.service";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
} from "@/server/localization/localization.service";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { toAccountOrder } from "@/utils";

const AccountPage = async () => {
  const { user } = await requireAccountPageContext(
    "/login?callbackUrl=%2Faccount",
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
    getShopCategories(defaultLocale),
    getActiveLocaleCodes(),
    getActiveRegionCodes(),
  ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, defaultLocale));

  return (
    <Container maxWidth="lg">
      <AccountPageView
        locale={defaultLocale}
        country={country}
        availableLocales={availableLocales}
        availableCountries={availableCountries}
        homeHref="/"
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

export default AccountPage;
