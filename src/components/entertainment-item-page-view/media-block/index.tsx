import { Box, Typography } from "@mui/material";

import { displayFont, leadSx } from "@/theme/sx";
import { formatFileSize } from "@/utils";

import { ArrowLink } from "../../arrow-link";
import { EntertainmentPlayer } from "../../entertainment-player";
import type { EntertainmentMediaBlockProps } from "../types";

const frameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "16 / 9",
  px: 3,
  border: "1px dashed var(--color-border)",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-card)",
  textAlign: "center",
} as const;

const embedSx = {
  width: "100%",
  aspectRatio: "16 / 9",
  border: 0,
  borderRadius: "var(--radius-panel)",
  overflow: "hidden",
} as const;

export const EntertainmentMediaBlock = ({
  item,
  locale,
  labels,
}: EntertainmentMediaBlockProps) => {
  const { media } = item;

  if (media.type === "download") {
    return (
      <Box sx={frameSx}>
        <Box>
          <Typography component="p" sx={leadSx}>
            {formatFileSize(media.sizeBytes)}
          </Typography>

          <ArrowLink
            href={media.url}
            label={labels.download}
            sx={{ mt: 1.5 }}
          />
        </Box>
      </Box>
    );
  }

  if (media.status === "ready" && media.source) {
    if (media.source.kind === "hls") {
      return (
        <EntertainmentPlayer
          playlistUrl={media.source.playlistUrl}
          poster={item.poster?.src}
          title={item.title}
          locale={locale}
          playLabel={labels.play}
          qualityLabel={labels.quality}
          errorTitle={labels.errorTitle}
          errorText={labels.errorText}
        />
      );
    }

    if (media.source.kind === "youtube") {
      return (
        <Box
          component="iframe"
          src={`https://www.youtube-nocookie.com/embed/${media.source.videoId}`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          sx={embedSx}
        />
      );
    }

    return (
      <Box
        component="video"
        src={media.source.url}
        poster={item.poster?.src}
        controls
        playsInline
        preload="none"
        sx={{ ...embedSx, background: "var(--color-text)" }}
      />
    );
  }

  const isFailed = media.status === "failed";

  return (
    <Box sx={frameSx}>
      <Box>
        <Typography
          component="p"
          sx={{ fontFamily: displayFont, fontSize: 26, fontWeight: 600 }}
        >
          {isFailed ? labels.errorTitle : labels.processingTitle}
        </Typography>

        <Typography component="p" sx={{ ...leadSx, mt: 1.5 }}>
          {isFailed ? labels.errorText : labels.processingText}
        </Typography>
      </Box>
    </Box>
  );
};
