import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import { leadSx } from "@/theme/sx";

import type { FavoritesCompactEmptyStateProps } from "./types";

const wrapperSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  py: { xs: 6, md: 9 },
  px: 2,
} as const;

const haloSx = {
  display: "grid",
  placeItems: "center",
  width: { xs: 116, md: 140 },
  height: { xs: 116, md: 140 },
  borderRadius: "var(--radius-pill)",
  bgcolor: "var(--color-accent-pale)",
  color: "var(--color-action)",
} as const;

const titleSx = {
  mt: 3.5,
  fontSize: { xs: 20, md: 24 },
  fontWeight: 700,
  lineHeight: 1.25,
} as const;

const textSx = {
  ...leadSx,
  mt: 1.5,
  maxWidth: "44ch",
} as const;

export const FavoritesCompactEmptyState = ({
  title,
  text,
  actionLabel,
  shopHref,
}: FavoritesCompactEmptyStateProps) => {
  return (
    <Box sx={wrapperSx}>
      <Box sx={haloSx}>
        <FavoriteBorderIcon sx={{ fontSize: { xs: 52, md: 64 } }} />
      </Box>

      <Typography sx={titleSx}>{title}</Typography>
      <Typography sx={textSx}>{text}</Typography>

      <Link href={shopHref}>
        <Button
          component="span"
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          {actionLabel}
        </Button>
      </Link>
    </Box>
  );
};

export type { FavoritesCompactEmptyStateProps } from "./types";
