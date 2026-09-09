import { Box, CardContent, Typography } from "@mui/material";
import Link from "next/link";

import { cardFrameSx } from "@/theme/sx";

import { ArrowLink } from "../arrow-link";

import type { BookCardProps } from "./types";

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

const coverSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 1.75,
  aspectRatio: "297 / 210",
  borderRadius: "var(--radius-field)",
  fontSize: 56,
  overflow: "hidden",
} as const;

export const BookCard = ({
  book,
  detailsHref,
  detailsButton,
}: BookCardProps) => {
  const thumbnail = book.thumbnail;

  return (
    <Box sx={cardSx}>
      <CardContent sx={contentSx}>
        <Link href={detailsHref}>
          <Box
            sx={{
              ...coverSx,
              background: thumbnail?.bgColor ?? "var(--color-accent-pale)",
            }}
          >
            {thumbnail?.src ? (
              <Box
                component="img"
                src={thumbnail.src}
                alt={thumbnail.alt ?? book.title}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              (thumbnail?.emoji ?? book.emoji)
            )}
          </Box>
        </Link>

        {book.lang ? (
          <Typography
            component="p"
            sx={{
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "var(--color-text-muted)",
            }}
          >
            {book.lang}
          </Typography>
        ) : null}

        <Link href={detailsHref}>
          <Typography
            component="p"
            sx={{ mt: 0.5, fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}
          >
            {book.title}
          </Typography>
        </Link>

        <Box sx={{ mt: "auto", pt: 1.5 }}>
          <ArrowLink href={detailsHref} label={detailsButton} />
        </Box>
      </CardContent>
    </Box>
  );
};
