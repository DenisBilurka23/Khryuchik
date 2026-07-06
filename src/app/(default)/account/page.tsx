import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { getShopCategories } from "@/data/products";
import { defaultLocale } from "@/i18n/config";
import { requireAccountPageContext } from "@/server/auth/page-context";
import { getRequestCountry } from "@/server/country/request-country";
import { getUserPurchasedDownloads } from "@/server/downloads/downloads.service";
import { getActiveLocaleCodes } from "@/server/localization/localization.service";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { toAccountOrder } from "@/utils";

const AccountPage = async () => {
  const { user } = await requireAccountPageContext("/login?callbackUrl=%2Faccount");

  const [country, rawOrders, downloads, categories, availableLocales] =
    await Promise.all([
      getRequestCountry(),
      findOrdersForUser(user.id, user.email),
      getUserPurchasedDownloads(user.id, user.email),
      getShopCategories(defaultLocale),
      getActiveLocaleCodes(),
    ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, defaultLocale));

  return (
    <Container maxWidth="lg">
      <AccountPageView
        locale={defaultLocale}
        country={country}
        availableLocales={availableLocales}
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
