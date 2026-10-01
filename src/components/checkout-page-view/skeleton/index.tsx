import { Container, Grid, Skeleton, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { getLocalizedPath } from "@/utils";

import { CheckoutHero } from "../hero";
import type { CheckoutPageSkeletonProps } from "../types";

const cardSx = { borderRadius: "var(--radius-card)" } as const;

export const CheckoutPageSkeleton = ({ locale }: CheckoutPageSkeletonProps) => {
  const t = useTranslations("storefront.checkoutPage");

  return (
    <PageShell>
      <Container maxWidth="lg">
        <Breadcrumbs
          items={[
            {
              label: t("breadcrumbs.home"),
              href: getLocalizedPath(locale, "/"),
            },
            {
              label: t("breadcrumbs.cart"),
              href: getLocalizedPath(locale, "/cart"),
            },
            { label: t("breadcrumbs.current") },
          ]}
        />

        <CheckoutHero
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
        />

        <Grid container spacing={4} alignItems="flex-start" aria-hidden="true">
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Stack spacing={4}>
              <Skeleton variant="rounded" height={280} sx={cardSx} />
              <Skeleton variant="rounded" height={360} sx={cardSx} />
              <Skeleton variant="rounded" height={220} sx={cardSx} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Skeleton variant="rounded" height={420} sx={cardSx} />
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
};
