import { Box, Typography } from "@mui/material";
import Image from "next/image";

import cartHeroImage from "@/assets/CartHero.png";
import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";

import type { CartHeroProps } from "./types";

const heroSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1.9fr) minmax(0, 1fr)",
  },
  alignItems: "center",
  gap: { xs: 3, md: 4 },
  p: { xs: "24px 20px", md: "28px 40px" },
} as const;

const contentSx = {
  minWidth: 0,
} as const;

const artSx = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: { xs: "center", md: "flex-end" },
  minWidth: 0,
  width: { xs: "min(80%, 320px)", md: "auto" },
  marginInline: { xs: "auto", md: 0 },
  mb: { xs: 0, md: "-22px" },
} as const;

const artImageStyle = {
  width: "100%",
  maxWidth: 340,
  height: "auto",
  objectFit: "contain",
} as const;

export const CartHero = ({ eyebrow, title, lead }: CartHeroProps) => {
  return (
    <HeroPanel tone="pale" sx={heroSx}>
      <Box sx={contentSx}>
        <SectionEyebrow label={eyebrow} />

        <Typography
          variant="h1"
          sx={{ mt: 2, fontSize: "clamp(32px, 3.6vw, 48px)" }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            maxWidth: "62ch",
            mt: 2,
            fontSize: { xs: 16, md: 17 },
            lineHeight: 1.65,
            color: "var(--color-text)",
          }}
        >
          {lead}
        </Typography>
      </Box>

      <Box sx={artSx}>
        <Image
          src={cartHeroImage}
          alt={title}
          sizes="(max-width: 900px) 80vw, 340px"
          priority
          style={artImageStyle}
        />
      </Box>
    </HeroPanel>
  );
};

export type { CartHeroProps } from "./types";
