import { Box, Container, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterSection } from "@/components/newsletter-section";
import { PageShell } from "@/components/page-shell";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { getLocalizedPath } from "@/utils";

import { ShopHero } from "../hero";
import type { ShopPageViewProps } from "../types";

const catalogSx = { mt: { xs: 5, md: 7 } } as const;

const catalogTitleSx = {
  mt: 1.25,
  fontSize: { xs: 32, md: 40 },
  lineHeight: 1.1,
} as const;

export const ShopPageView = async ({ locale, children }: ShopPageViewProps) => {
  const tShopPage = await getTranslations({
    locale,
    namespace: "storefront.shopPage",
  });

  return (
    <PageShell>
      <Box component="section" sx={{ pb: 7 }}>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: tShopPage("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              { label: tShopPage("breadcrumbs.current") },
            ]}
          />

          <ShopHero
            eyebrow={tShopPage("hero.eyebrow")}
            title={tShopPage("hero.title")}
            lead={tShopPage("hero.lead")}
          />

          <Box sx={catalogSx}>
            <SectionEyebrow label={tShopPage("catalog.eyebrow")} />
            <Typography variant="h2" sx={catalogTitleSx}>
              {tShopPage("catalog.title")}
            </Typography>
            {children}
          </Box>
        </Container>
      </Box>

      <Suspense fallback={null}>
        <NewsletterSection locale={locale} />
      </Suspense>
    </PageShell>
  );
};
