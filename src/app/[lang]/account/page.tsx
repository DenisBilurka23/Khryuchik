import { notFound, redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { getShopCategories } from "@/data/products";
import {
  getActiveLocaleCodes,
  isActiveLocale,
} from "@/server/localization/localization.service";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { getUserPurchasedDownloads } from "@/server/downloads/downloads.service";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";
import { toAccountOrder } from "@/utils";
import type { LocalizedAccountPageProps } from "@/types/auth-pages";

const LocalizedAccountPage = async ({ params }: LocalizedAccountPageProps) => {
  const { lang } = await params;

  if (!(await isActiveLocale(lang))) {
    notFound();
  }

  const session = await getServerAuthSession();

  if (!session) {
    redirect(`/${lang}/login?callbackUrl=${encodeURIComponent(`/${lang}/account`)}`);
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
      getShopCategories(lang),
      getActiveLocaleCodes(),
    ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, lang));

  return (
    <Container maxWidth="lg">
      <AccountPageView
        locale={lang}
        country={country}
        availableLocales={availableLocales}
        homeHref={lang === "en" ? "/" : `/${lang}`}
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

export default LocalizedAccountPage;