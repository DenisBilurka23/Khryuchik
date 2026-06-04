import { redirect } from "next/navigation";
import { Container } from "@mui/material";

import { AccountPageView } from "@/components/account-page-view";
import { defaultLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { getAccountUserByEmail, getAccountUserById } from "@/server/users/services/users.service";
import { toAccountOrder } from "@/utils";

const AccountPage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login?callbackUrl=%2Faccount");
  }

  const [country, user, rawOrders] = await Promise.all([
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
  ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, defaultLocale));

  return (
    <Container maxWidth="lg">
      <AccountPageView
        locale={defaultLocale}
        country={country}
        homeHref="/"
        user={user ?? session.user ?? {}}
        orders={orders}
      />
    </Container>
  );
};

export default AccountPage;