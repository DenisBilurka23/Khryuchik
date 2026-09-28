import { Box, Container } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsletterSection } from "@/components/newsletter-section";
import { PageShell } from "@/components/page-shell";
import { getLocalizedPath } from "@/utils";

import { EntertainmentHero } from "../hero";
import type { EntertainmentPageViewProps } from "../types";

export const EntertainmentPageView = async ({
  locale,
  children,
}: EntertainmentPageViewProps) => {
  const tPage = await getTranslations({
    locale,
    namespace: "storefront.entertainmentPage",
  });

  return (
    <PageShell>
      <Box component="section" sx={{ pb: 7 }}>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: tPage("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              { label: tPage("breadcrumbs.entertainment") },
            ]}
          />

          <EntertainmentHero
            eyebrow={tPage("hero.eyebrow")}
            title={tPage("hero.title")}
            lead={tPage("hero.lead")}
          />

          <Box sx={{ mt: { xs: 5, md: 7 } }}>{children}</Box>
        </Container>
      </Box>

      <Suspense fallback={null}>
        <NewsletterSection locale={locale} />
      </Suspense>
    </PageShell>
  );
};
