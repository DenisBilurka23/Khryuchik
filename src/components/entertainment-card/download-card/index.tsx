import { Box, CardContent, Typography } from "@mui/material";

import { cardFrameSx } from "@/theme/sx";
import { formatFileSize } from "@/utils";

import { ArrowLink } from "../../arrow-link";
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
  downloadLabel,
}: EntertainmentDownloadCardProps) => {
  if (item.media.type !== "download") {
    return null;
  }

  const { url, sizeBytes } = item.media;

  return (
    <Box sx={cardSx}>
      <CardContent sx={contentSx}>
        <EntertainmentPoster
          poster={item.poster}
          category={item.category}
          alt={item.title}
        />

        <Typography
          component="p"
          sx={{ mt: 1.75, fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}
        >
          {item.title}
        </Typography>

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
            {formatFileSize(sizeBytes)}
          </Typography>

          <ArrowLink href={url} label={downloadLabel} size="sm" />
        </Box>
      </CardContent>
    </Box>
  );
};
