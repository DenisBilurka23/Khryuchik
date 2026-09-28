import type { Metadata } from "next";
import { Container } from "@mui/material";
import { Suspense } from "react";
import {
  AccountPageSkeleton,
  AccountPageView,
} from "@/components/account-page-view";
import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { PageShell } from "@/components/page-shell";
import { getShopCategories } from "@/server/catalog/services/categories.service";
import {
  getActiveLocaleCodes,
  getActiveRegionCodes,
} from "@/server/localization/localization.service";
import { requireAccountPageContext } from "@/server/auth/page-context";
import { getRequestCountry } from "@/server/country/request-country";
import { getUserPurchasedDownloads } from "@/server/downloads/downloads.service";
import { findOrdersForUser } from "@/server/orders/repositories/orders.repository";
import { getUserReviewsByProduct } from "@/server/reviews/services/reviews.service";
import { getProductPreviewsByIds } from "@/server/catalog/services/catalog.service";
import { getLocalizedPath, toAccountOrder } from "@/utils";
import type { LocalizedAccountPageProps } from "@/types/auth-pages";
import { requireActiveLocale } from "@/server/i18n/require-active-locale";
import { NOINDEX_ROBOTS } from "@/constants/seo";

export const metadata: Metadata = { robots: NOINDEX_ROBOTS };

type AccountPageDataProps = {
  locale: Locale;
  user: Awaited<ReturnType<typeof requireAccountPageContext>>["user"];
};

const AccountPageData = async ({ locale, user }: AccountPageDataProps) => {
  const [
    country,
    rawOrders,
    downloads,
    categories,
    availableLocales,
    availableCountries,
    productReviews,
  ] = await Promise.all([
    getRequestCountry(),
    findOrdersForUser(user.id, user.email),
    getUserPurchasedDownloads(user.id, user.email),
    getShopCategories(locale),
    getActiveLocaleCodes(),
    getActiveRegionCodes(),
    getUserReviewsByProduct(user.id, locale),
  ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, locale));
  const orderProducts = await getProductPreviewsByIds(locale, [
    ...new Set(
      rawOrders.flatMap((order) => order.items.map((item) => item.productId)),
    ),
  ]);

  return (
    <AccountPageView
      locale={locale}
      country={country}
      availableLocales={availableLocales}
      availableCountries={availableCountries}
      homeHref={locale === defaultLocale ? "/" : `/${locale}`}
      favoriteCategoryLabels={Object.fromEntries(
        categories.map((category) => [category.key, category.label]),
      )}
      user={user}
      orders={orders}
      orderProducts={orderProducts}
      productReviews={productReviews}
      downloads={downloads}
    />
  );
};

const LocalizedAccountPage = async ({ params }: LocalizedAccountPageProps) => {
  const { lang } = await params;
  const locale = await requireActiveLocale(lang);

  const { user } = await requireAccountPageContext(
    getLocalizedPath(
      locale,
      `/login?callbackUrl=${encodeURIComponent(getLocalizedPath(locale, "/account"))}`,
    ),
  );

  return (
    <PageShell>
      <Container maxWidth="lg">
        <Suspense fallback={<AccountPageSkeleton />}>
          <AccountPageData locale={locale} user={user} />
        </Suspense>
      </Container>
    </PageShell>
  );
};

export default LocalizedAccountPage;
