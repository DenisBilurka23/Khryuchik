import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { getLocalizedPath } from "@/utils";

import { CartHero } from "../hero";
import { CartLoading } from "../loading";
import type { CartPageSkeletonProps } from "../types";

export const CartPageSkeleton = ({ locale }: CartPageSkeletonProps) => {
  const t = useTranslations("storefront.cartPage");

  return (
    <PageShell>
      <Box component="section">
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: t("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              {
                label: t("breadcrumbs.shop"),
                href: getLocalizedPath(locale, "/shop"),
              },
              { label: t("breadcrumbs.current") },
            ]}
          />

          <CartHero
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
          />

          <CartLoading status={t("loading")} />
        </Container>
      </Box>
    </PageShell>
  );
};
