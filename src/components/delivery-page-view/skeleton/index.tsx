import { Box, Container, Skeleton, Stack } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/page-shell";
import type { DeliveryPageLabels } from "@/i18n/types";

import { DeliveryHeroSection } from "../sections";
import type { DeliveryPageSkeletonProps } from "../types";

const blockSx = { borderRadius: "var(--radius-panel)" } as const;

export const DeliveryPageSkeleton = async ({
  locale,
  region,
}: DeliveryPageSkeletonProps) => {
  const [t, tRegions] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.deliveryPage" }),
    getTranslations({ locale, namespace: "storefront.regions" }),
  ]);
  const hero = t.raw("hero") as DeliveryPageLabels["hero"];

  return (
    <PageShell>
      <DeliveryHeroSection
        {...hero}
        region={region}
        regionLabel={tRegions(`${region}.label`)}
      />
      <Box component="section" aria-hidden="true" sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Skeleton variant="rounded" height={260} sx={blockSx} />
            <Skeleton variant="rounded" height={360} sx={blockSx} />
          </Stack>
        </Container>
      </Box>
    </PageShell>
  );
};
