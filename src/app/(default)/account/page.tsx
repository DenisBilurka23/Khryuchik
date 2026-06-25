import { redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { getShopCategories } from "@/data/products";
import { defaultLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getUserPurchasedDownloads } from "@/server/downloads/downloads.service";
import { getActiveLocaleCodes } from "@/server/localization/localization.service";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import {
  getAccountUserByEmail,
  getAccountUserById,
} from "@/server/users/services/users.service";
import { toAccountOrder } from "@/utils";

const AccountPage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login?callbackUrl=%2Faccount");
  }

  const userId = session.user.id || undefined;
  const userEmail = session.user.email ?? undefined;

  const [country, user, rawOrders, downloads, categories, availableLocales] =
    await Promise.all([
      getRequestCountry(),
      userId
        ? getAccountUserById(userId)
        : userEmail
          ? getAccountUserByEmail(userEmail)
          : Promise.resolve(null),
      findOrdersForUser(userId, userEmail),
      getUserPurchasedDownloads(userId, userEmail),
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
        user={user ?? session.user ?? {}}
        orders={orders}
        downloads={downloads}
      />
    </Container>
  );
};

export default AccountPage;
