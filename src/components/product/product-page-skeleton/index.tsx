import { Box, Container, Divider, Grid, Skeleton, Stack } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { PRODUCT_SKELETON_THUMB_COUNT } from "@/constants/loading";
import { getLocalizedPath } from "@/utils";

import {
  productPriceRowSx,
  productSubtitleSx,
  productTitleRowSx,
} from "../product-info/styles";
import type { ProductPageSkeletonProps } from "../types";

const stageSx = {
  width: "100%",
  height: "auto",
  aspectRatio: "5 / 3",
  borderRadius: "var(--radius-hero)",
} as const;

const thumbsSx = {
  display: "grid",
  gridTemplateColumns: `repeat(${PRODUCT_SKELETON_THUMB_COUNT}, minmax(0, 1fr))`,
  gap: 2,
  mt: 2,
} as const;

const thumbSx = { borderRadius: "var(--radius-plate)" } as const;

const chipSx = { borderRadius: "var(--radius-pill)" } as const;

const titleSx = { fontSize: { xs: 32, md: 40 } } as const;

const priceSx = { fontSize: 32 } as const;

const controlsSx = {
  mt: 4,
  borderRadius: "var(--radius-card)",
} as const;

const tabsSx = {
  mt: 6,
  borderRadius: "var(--radius-panel)",
} as const;

export const ProductPageSkeleton = async ({
  locale,
}: ProductPageSkeletonProps) => {
  const tProductPage = await getTranslations({
    locale,
    namespace: "storefront.productPage",
  });

  return (
    <PageShell>
      <Box>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: tProductPage("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              {
                label: tProductPage("breadcrumbs.shop"),
                href: getLocalizedPath(locale, "/shop"),
              },
            ]}
          />

          <Grid
            container
            spacing={5}
            alignItems="flex-start"
            aria-hidden="true"
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rounded" sx={stageSx} />
              <Box sx={thumbsSx}>
                {Array.from(
                  { length: PRODUCT_SKELETON_THUMB_COUNT },
                  (_, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      height={96}
                      sx={thumbSx}
                    />
                  ),
                )}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Stack spacing={1.5}>
                <Skeleton variant="text" width="35%" />
                <Skeleton variant="text" width="55%" />
                <Skeleton variant="text" width="45%" />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rounded" width={110} height={32} sx={chipSx} />
              <Box sx={productTitleRowSx}>
                <Skeleton variant="text" width="85%" sx={titleSx} />
              </Box>
              <Box sx={productSubtitleSx}>
                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="70%" />
              </Box>
              <Box sx={productPriceRowSx}>
                <Skeleton variant="text" width={120} sx={priceSx} />
              </Box>
              <Skeleton variant="rounded" height={240} sx={controlsSx} />
            </Grid>
          </Grid>

          <Skeleton
            variant="rounded"
            height={240}
            aria-hidden="true"
            sx={tabsSx}
          />
        </Container>
      </Box>
    </PageShell>
  );
};
