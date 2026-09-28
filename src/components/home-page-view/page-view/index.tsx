import { HeroSection } from "@/components/hero-section";
import { Suspense } from "react";
import { NewsletterSection } from "@/components/newsletter-section";
import { OrderSection } from "@/components/order-section";
import { PageShell } from "@/components/page-shell";
import { createStorefrontHeaderViewModel } from "@/components/storefront-header/navigation";

import type { HomePageViewProps } from "../types";

export const HomePageView = ({
  locale,
  books,
  shop,
  entertainment,
}: HomePageViewProps) => {
  const { navigationPaths } = createStorefrontHeaderViewModel(locale);
  const { shop: shopHref, cart: cartHref } = navigationPaths;

  return (
    <PageShell>
      <HeroSection locale={locale} />
      {books}
      {shop}
      {entertainment}
      <OrderSection locale={locale} shopHref={shopHref} cartHref={cartHref} />
      <Suspense fallback={null}>
        <NewsletterSection locale={locale} />
      </Suspense>
    </PageShell>
  );
};
