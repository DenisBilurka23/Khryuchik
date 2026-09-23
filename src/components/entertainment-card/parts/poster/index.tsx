import { Box } from "@mui/material";
import Image from "next/image";

import { ENTERTAINMENT_PLACEHOLDER_EMOJI } from "@/constants/entertainment";

import type { EntertainmentPosterProps } from "../../types";

const posterSizes =
  "(max-width: 599px) 100vw, (max-width: 899px) 50vw, (max-width: 1279px) 33vw, 320px";

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
        <Image
          src={poster.src}
          alt={poster.alt ?? alt}
          fill
          sizes={posterSizes}
          style={{ objectFit: "cover" }}
        />
      ) : (
        (poster?.emoji ?? ENTERTAINMENT_PLACEHOLDER_EMOJI[category])
      )}

      {children}
    </Box>
  );
};
