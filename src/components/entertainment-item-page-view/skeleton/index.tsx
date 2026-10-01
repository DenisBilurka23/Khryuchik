import { Box, Container, Skeleton } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { leadSx } from "@/theme/sx";
import { getLocalizedPath } from "@/utils";

import { itemCopySx, itemMetaSx, itemTitleSx } from "../styles";
import type { EntertainmentItemPageSkeletonProps } from "../types";

const playerSx = {
  width: "100%",
  height: "auto",
  aspectRatio: "16 / 9",
  borderRadius: "var(--radius-panel)",
} as const;

const leadSkeletonSx = { ...leadSx, mt: 2.5 } as const;

export const EntertainmentItemPageSkeleton = async ({
  locale,
}: EntertainmentItemPageSkeletonProps) => {
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
              {
                label: tPage("breadcrumbs.entertainment"),
                href: getLocalizedPath(locale, "/entertainment"),
              },
            ]}
          />

          <Box aria-hidden="true">
            <Skeleton variant="rounded" sx={playerSx} />

            <Box sx={itemCopySx}>
              <Skeleton variant="text" width="60%" sx={itemTitleSx} />
              <Skeleton
                variant="text"
                width={72}
                sx={{ ...itemMetaSx, mt: 1 }}
              />
              <Box sx={leadSkeletonSx}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </PageShell>
  );
};
