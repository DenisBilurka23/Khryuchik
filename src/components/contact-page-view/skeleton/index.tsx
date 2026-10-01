import { Box, Container, Skeleton, Stack } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { PageShell } from "@/components/page-shell";
import { Plate } from "@/components/primitives";
import type { ContactPageLabels } from "@/i18n/types";

import { ContactHero } from "../hero";
import { contactPanelSx } from "../styles";
import type { ContactPageSkeletonProps } from "../types";

const rowSx = { borderRadius: "var(--radius-field)" } as const;

const headingSx = { fontSize: 26 } as const;

export const ContactPageSkeleton = async ({
  locale,
}: ContactPageSkeletonProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.contactPage",
  });
  const hero = t.raw("hero") as ContactPageLabels["hero"];

  return (
    <PageShell>
      <Box component="section" sx={{ pt: { xs: 3, md: 6 } }}>
        <Container maxWidth="lg">
          <ContactHero
            eyebrow={hero.eyebrow}
            titlePrefix={hero.titlePrefix}
            titleAccent={hero.titleAccent}
            lede={hero.lede}
          />

          <Box aria-hidden="true" sx={contactPanelSx}>
            <Plate pad="lg">
              <Skeleton variant="text" width="55%" sx={headingSx} />
              <Skeleton variant="text" width="80%" />
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                <Skeleton variant="rounded" height={64} sx={rowSx} />
                <Skeleton variant="rounded" height={64} sx={rowSx} />
                <Skeleton variant="rounded" height={64} sx={rowSx} />
              </Stack>
            </Plate>

            <Plate pad="lg">
              <Skeleton variant="text" width="45%" sx={headingSx} />
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Skeleton variant="rounded" height={56} sx={rowSx} />
                <Skeleton variant="rounded" height={56} sx={rowSx} />
                <Skeleton variant="rounded" height={140} sx={rowSx} />
                <Skeleton
                  variant="rounded"
                  width={180}
                  height={48}
                  sx={rowSx}
                />
              </Stack>
            </Plate>
          </Box>
        </Container>
      </Box>
    </PageShell>
  );
};
