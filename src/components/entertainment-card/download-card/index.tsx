import { Box, CardContent, Typography } from "@mui/material";
import Link from "next/link";

import { EntertainmentDownloadLink } from "@/components/entertainment-download-link";
import {
  LinkPendingOverlay,
  LinkPendingProvider,
  LinkPendingSignal,
} from "@/components/link-pending";
import { cardFrameSx } from "@/theme/sx";
import { getEntertainmentDownloadMeta } from "@/utils";

import { EntertainmentPoster } from "../parts/poster";
import type { EntertainmentDownloadCardProps } from "../types";

const cardSx = {
  ...cardFrameSx,
  borderRadius: "var(--radius-card)",
  boxShadow: "none",
} as const;

const contentSx = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  p: 1.5,
  "&:last-child": { pb: 1.5 },
} as const;

export const EntertainmentDownloadCard = ({
  item,
  href,
  downloadLabel,
}: EntertainmentDownloadCardProps) => {
  if (item.media.type !== "download") {
    return null;
  }

  return (
    <LinkPendingProvider>
      <Box sx={cardSx}>
        <CardContent sx={contentSx}>
          <Link href={href}>
            <LinkPendingSignal />
            <EntertainmentPoster
              poster={item.poster}
              category={item.category}
              alt={item.title}
            >
              <LinkPendingOverlay />
            </EntertainmentPoster>
          </Link>

          <Link href={href}>
            <LinkPendingSignal />
            <Typography
              component="p"
              sx={{ mt: 1.75, fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}
            >
              {item.title}
            </Typography>
          </Link>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mt: "auto",
              pt: 1.5,
            }}
          >
            <Typography
              component="span"
              sx={{ fontSize: 13, color: "var(--color-text-muted)" }}
            >
              {getEntertainmentDownloadMeta(item.media)}
            </Typography>

            <EntertainmentDownloadLink slug={item.slug} label={downloadLabel} />
          </Box>
        </CardContent>
      </Box>
    </LinkPendingProvider>
  );
};
