import { Box, Container, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Pill } from "@/components/primitives";
import { leadSx } from "@/theme/sx";
import { formatVideoDuration, getLocalizedPath } from "@/utils";

import { NewsletterSection } from "@/components/newsletter-section";
import { PageShell } from "@/components/page-shell";

import { EntertainmentMediaBlock } from "./media-block";
import type { EntertainmentItemPageViewProps } from "./types";
import { createVideoStructuredData } from "./utils";

const titleSx = {
  mt: 3.5,
  fontSize: { xs: 30, md: 40 },
  lineHeight: 1.1,
} as const;

const copySx = {
  maxWidth: 760,
} as const;

const metaSx = {
  fontSize: 14,
  color: "var(--color-text-muted)",
} as const;

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

          <Box sx={copySx}>
            <Typography variant="h1" sx={titleSx}>
              {item.title}
            </Typography>

            {durationSeconds || isAdmin ? (
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                flexWrap="wrap"
                sx={{ mt: 1 }}
              >
                {durationSeconds ? (
                  <Typography component="p" sx={metaSx}>
                    {formatVideoDuration(durationSeconds)}
                  </Typography>
                ) : null}

                {isAdmin ? (
                  <Pill tone="cream">
                    {tPage("viewsBadge", { count: item.viewCount })}
                  </Pill>
                ) : null}
              </Stack>
            ) : null}

            {item.description ? (
              <Typography component="p" sx={{ ...leadSx, mt: 2.5 }}>
                {item.description}
              </Typography>
            ) : null}
          </Box>
        </Container>
      </Box>

      <NewsletterSection locale={locale} />
    </PageShell>
  );
};

export type {
  EntertainmentItemPageViewProps,
  EntertainmentMediaLabels,
} from "./types";
