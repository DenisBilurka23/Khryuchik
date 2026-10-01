import { Box, Container, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Pill } from "@/components/primitives";
import { leadSx } from "@/theme/sx";
import { formatVideoDuration, getLocalizedPath } from "@/utils";

import { NewsletterSection } from "@/components/newsletter-section";
import { PageShell } from "@/components/page-shell";

import { EntertainmentMediaBlock } from "./media-block";
import { itemCopySx, itemMetaSx, itemTitleSx } from "./styles";
import type {
  AdminViewBadgeProps,
  EntertainmentItemPageViewProps,
} from "./types";
import { createVideoStructuredData } from "./utils";

const AdminViewBadge = async ({
  isAdmin,
  label,
  hasDuration,
}: AdminViewBadgeProps) =>
  (await isAdmin) ? (
    <Pill tone="cream" sx={{ mt: hasDuration ? 0 : 1 }}>
      {label}
    </Pill>
  ) : null;

export const EntertainmentItemPageView = async ({
  locale,
  item,
  isAdmin,
}: EntertainmentItemPageViewProps) => {
  const [tPage, tSection, tPlayer] = await Promise.all([
    getTranslations({ locale, namespace: "storefront.entertainmentPage" }),
    getTranslations({ locale, namespace: "storefront.entertainmentSection" }),
    getTranslations({ locale, namespace: "storefront.entertainmentPlayer" }),
  ]);

  const structuredData = createVideoStructuredData(item);
  const durationSeconds =
    item.media.type === "video" ? item.media.durationSeconds : null;

  return (
    <PageShell>
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}

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
              { label: item.title },
            ]}
          />

          <EntertainmentMediaBlock
            item={item}
            locale={locale}
            labels={{
              play: tPlayer("playAction"),
              quality: tPlayer("qualityLabel"),
              audio: tPlayer("audioLabel"),
              captions: tPlayer("captionsLabel"),
              errorTitle: tPlayer("errorTitle"),
              errorText: tPlayer("errorText"),
              processingTitle: tPlayer("processingTitle"),
              processingText: tPlayer("processingText"),
              download: tSection("downloadAction"),
            }}
          />

          <Box sx={itemCopySx}>
            <Typography variant="h1" sx={itemTitleSx}>
              {item.title}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              flexWrap="wrap"
              sx={{ mt: durationSeconds ? 1 : 0 }}
            >
              {durationSeconds ? (
                <Typography component="p" sx={itemMetaSx}>
                  {formatVideoDuration(durationSeconds)}
                </Typography>
              ) : null}

              <Suspense fallback={null}>
                <AdminViewBadge
                  isAdmin={isAdmin}
                  label={tPage("viewsBadge", { count: item.viewCount })}
                  hasDuration={Boolean(durationSeconds)}
                />
              </Suspense>
            </Stack>

            {item.description ? (
              <Typography component="p" sx={{ ...leadSx, mt: 2.5 }}>
                {item.description}
              </Typography>
            ) : null}
          </Box>
        </Container>
      </Box>

      <Suspense fallback={null}>
        <NewsletterSection locale={locale} />
      </Suspense>
    </PageShell>
  );
};

export { EntertainmentItemPageSkeleton } from "./skeleton";
export type {
  EntertainmentItemPageSkeletonProps,
  EntertainmentItemPageViewProps,
  EntertainmentMediaLabels,
} from "./types";
