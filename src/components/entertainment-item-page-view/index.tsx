import { Box, Container, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { leadSx } from "@/theme/sx";
import { formatVideoDuration, getLocalizedPath } from "@/utils";

import { NewsletterSection } from "../newsletter-section";
import { PageShell } from "../storefront/page-shell";

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

export const EntertainmentItemPageView = async ({
  locale,
  item,
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

            {durationSeconds ? (
              <Typography
                component="p"
                sx={{ mt: 1, fontSize: 14, color: "var(--color-text-muted)" }}
              >
                {formatVideoDuration(durationSeconds)}
              </Typography>
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
