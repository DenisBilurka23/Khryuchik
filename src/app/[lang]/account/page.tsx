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

  const [country, user, rawOrders, categories, availableLocales] =
    await Promise.all([
      getRequestCountry(),
      session.user.id
        ? getAccountUserById(session.user.id)
        : session.user.email
          ? getAccountUserByEmail(session.user.email)
          : Promise.resolve(null),
      findOrdersForUser(
        session.user.id || undefined,
        session.user.email ?? undefined,
      ),
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
      />
    </Container>
  );
};

export default LocalizedAccountPage;