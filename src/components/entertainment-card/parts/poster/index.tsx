import { Box } from "@mui/material";

import { ENTERTAINMENT_PLACEHOLDER_EMOJI } from "@/constants/entertainment";

import type { EntertainmentPosterProps } from "../../types";

const posterSx = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "1 / 1",
  borderRadius: "var(--radius-field)",
  fontSize: 56,
  overflow: "hidden",
} as const;

export const EntertainmentPoster = ({
  poster,
  category,
  alt,
  children,
}: EntertainmentPosterProps) => {
  return (
    <Box
      sx={{
        ...posterSx,
        background: poster?.bgColor ?? "var(--color-accent-pale)",
      }}
    >
      {poster?.src ? (
        <Box
          component="img"
          src={poster.src}
          alt={poster.alt ?? alt}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        (poster?.emoji ?? ENTERTAINMENT_PLACEHOLDER_EMOJI[category])
      )}

      {children}
    </Box>
  );
};
