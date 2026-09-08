import { BookSection } from "../books-section";
import { HeroSection } from "../hero-section";
import { NewsletterSection } from "../newsletter-section";
import { OrderSection } from "../order-section";
import { ShopSection } from "../shop-section";

import { createStorefrontHeaderViewModel } from "../storefront-header/navigation";

import { PageShell } from "./page-shell";
import type { StorefrontProps } from "./types";

export const Storefront = async ({
  locale,
  shopCategories,
  books,
  shopProducts,
  selectedShopCategory,
}: StorefrontProps) => {
  const { navigationPaths } = createStorefrontHeaderViewModel(locale);
  const { shop: shopHref, cart: cartHref } = navigationPaths;

  return (
    <PageShell>
      <HeroSection locale={locale} />
      {books.length > 0 ? <BookSection locale={locale} books={books} /> : null}
      {shopCategories.length > 0 && shopProducts.length > 0 ? (
        <ShopSection
          locale={locale}
          categories={shopCategories}
          products={shopProducts}
          selectedFilter={selectedShopCategory}
        />
      ) : null}
      <OrderSection locale={locale} shopHref={shopHref} cartHref={cartHref} />
      <NewsletterSection locale={locale} />
    </PageShell>
  );
};

export type { StorefrontProps } from "./types";
