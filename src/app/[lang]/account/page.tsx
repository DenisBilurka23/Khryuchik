import { Container } from "@mui/material";
import { AccountPageView } from "@/components/account-page-view";
import { defaultLocale } from "@/i18n/config";
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

const LocalizedAccountPage = async ({ params }: LocalizedAccountPageProps) => {
  const { lang } = await params;

  await requireActiveLocale(lang);

  const { user } = await requireAccountPageContext(
    getLocalizedPath(
      lang,
      `/login?callbackUrl=${encodeURIComponent(getLocalizedPath(lang, "/account"))}`,
    ),
  );

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
    getShopCategories(lang),
    getActiveLocaleCodes(),
    getActiveRegionCodes(),
    getUserReviewsByProduct(user.id, lang),
  ]);
  const orders = rawOrders.map((order) => toAccountOrder(order, lang));
  const orderProducts = await getProductPreviewsByIds(lang, [
    ...new Set(
      rawOrders.flatMap((order) => order.items.map((item) => item.productId)),
    ),
  ]);

  return (
    <PageShell>
      <Container maxWidth="lg">
        <AccountPageView
          locale={lang}
          country={country}
          availableLocales={availableLocales}
          availableCountries={availableCountries}
          homeHref={lang === defaultLocale ? "/" : `/${lang}`}
          favoriteCategoryLabels={Object.fromEntries(
            categories.map((category) => [category.key, category.label]),
          )}
          user={user}
          orders={orders}
          orderProducts={orderProducts}
          productReviews={productReviews}
          downloads={downloads}
        />
      </Container>
    </PageShell>
  );
};

export default LocalizedAccountPage;
