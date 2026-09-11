import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, CardContent, Typography } from "@mui/material";
import Link from "next/link";

import { cardFrameSx } from "@/theme/sx";
import { formatVideoDuration } from "@/utils";

import { ArrowLink } from "../../arrow-link";
import { EntertainmentPoster } from "../parts/poster";
import type { EntertainmentVideoCardProps } from "../types";

const cardSx = {
  ...cardFrameSx,
  borderRadius: "var(--radius-card)",
  boxShadow: "none",
  "&:hover .play-badge": { transform: "scale(1.06)", opacity: 1 },
} as const;

const contentSx = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  p: 1.5,
  "&:last-child": { pb: 1.5 },
} as const;

const playBadgeSx = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-card)",
  color: "var(--color-action)",
  opacity: 0.92,
  boxShadow: "var(--shadow-card)",
  transition: "transform 0.2s ease, opacity 0.2s ease",
} as const;

export const EntertainmentVideoCard = ({
  item,
  href,
  watchLabel,
}: EntertainmentVideoCardProps) => {
  const durationSeconds =
    item.media.type === "video" ? item.media.durationSeconds : null;

  return (
    <Box sx={cardSx}>
      <CardContent sx={contentSx}>
        <Link href={href}>
          <EntertainmentPoster
            poster={item.poster}
            category={item.category}
            alt={item.title}
          >
            <Box className="play-badge" aria-hidden sx={playBadgeSx}>
              <PlayArrowRoundedIcon sx={{ fontSize: 32 }} />
            </Box>
          </EntertainmentPoster>
        </Link>

        <Link href={href}>
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
            justifyContent: durationSeconds ? "space-between" : "flex-end",
            gap: 1.5,
            mt: "auto",
            pt: 1.5,
          }}
        >
          {durationSeconds ? (
            <Typography
              component="span"
              sx={{ fontSize: 13, color: "var(--color-text-muted)" }}
            >
              {formatVideoDuration(durationSeconds)}
            </Typography>
          ) : null}

          <ArrowLink href={href} label={watchLabel} size="sm" />
        </Box>
      </CardContent>
    </Box>
  );
};
