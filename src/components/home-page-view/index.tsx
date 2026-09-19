import { BookSection } from "@/components/books-section";
import { EntertainmentSection } from "@/components/entertainment-section";
import { HeroSection } from "@/components/hero-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { OrderSection } from "@/components/order-section";
import { ShopSection } from "@/components/shop-section";

import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";

import { PageShell } from "@/components/page-shell";
import type { HomePageViewProps } from "./types";

export const HomePageView = async ({
  locale,
  shopCategories,
  books,
  shopProducts,
  selectedShopCategory,
  entertainment,
}: HomePageViewProps) => {
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
      {entertainment.availableCategories.length > 0 ? (
        <EntertainmentSection locale={locale} entertainment={entertainment} />
      ) : null}
      <OrderSection locale={locale} shopHref={shopHref} cartHref={cartHref} />
      <NewsletterSection locale={locale} />
    </PageShell>
  );
};

export type { HomePageViewProps } from "./types";
