import { Box } from "@mui/material";

import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";

import { BookSection } from "./books-section";
import { FooterSection } from "./footer-section";
import { HeroSection } from "./hero-section";
import { NewsletterSection } from "./newsletter-section";
import { OrderSection } from "./order-section";
import { ShopSection } from "./shop-section";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontThemeProvider } from "./storefront-theme-provider";
import { StorySection } from "./story-section";
import styles from "./storefront.module.css";
import type { StorefrontProps } from "./types";
import { getLocalizedPath } from "./utils";

const createStorefrontHeaderViewModel = (locale: Locale) => ({
  localizedPaths: Object.fromEntries(
    locales.map((targetLocale) => [
      targetLocale,
      targetLocale === defaultLocale ? "/" : `/${targetLocale}`,
    ]),
  ) as Record<Locale, string>,
  navigationPaths: {
    books: getLocalizedPath(locale, "/shop?category=books"),
    shop: getLocalizedPath(locale, "/shop"),
    story: "#story",
    faq: "#faq",
    cart: getLocalizedPath(locale, "/cart"),
  },
});

export const Storefront = ({
  locale,
  dictionary,
  shopCategories,
  books,
  shopProducts,
  selectedShopCategory,
}: StorefrontProps) => {
  const { localizedPaths, navigationPaths } = createStorefrontHeaderViewModel(locale);
  const { shop: shopHref, cart: cartHref } = navigationPaths;

  return (
    <StorefrontThemeProvider>
      <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
        <Box className={styles.pageContent}>
          <StorefrontHeader
            locale={locale}
            dictionary={dictionary}
            localizedPaths={localizedPaths}
            navigationPaths={navigationPaths}
          />
          <HeroSection locale={locale} dictionary={dictionary} />
          <BookSection locale={locale} dictionary={dictionary} books={books} />
          <ShopSection
            locale={locale}
            dictionary={dictionary}
            categories={shopCategories}
            products={shopProducts}
            selectedFilter={selectedShopCategory}
          />
          <StorySection dictionary={dictionary} />
          <OrderSection
            locale={locale}
            dictionary={dictionary}
            shopHref={shopHref}
            cartHref={cartHref}
          />
          <NewsletterSection dictionary={dictionary} />
          <FooterSection dictionary={dictionary} />
        </Box>
      </Box>
    </StorefrontThemeProvider>
  );
};
