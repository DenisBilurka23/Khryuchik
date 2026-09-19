import { Box, Typography } from "@mui/material";
import Image from "next/image";

import entertainmentHeroImage from "@/assets/HeroEntertainment.png";
import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";

import type { EntertainmentHeroProps } from "./types";

const heroSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 48fr) minmax(0, 52fr)",
  },
  alignItems: "center",
  gap: { xs: 3, xl: 4 },
  minHeight: { xs: 0, md: 340 },
  p: { xs: "24px 20px", md: 5 },
  borderRadius: { xs: "20px", md: "var(--radius-hero)" },
} as const;

const titleSx = {
  mt: 2.5,
  fontSize: { xs: 34, md: "clamp(28px, 3.4vw, 44px)" },
  lineHeight: 1.08,
} as const;

const heroLeadSx = {
  mt: 2.25,
  fontSize: { xs: 16, md: 18 },
  lineHeight: 1.65,
  color: "var(--color-text)",
} as const;

const artSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: { xs: "center", md: "flex-end" },
  minWidth: 0,
  width: { xs: "min(90%, 380px)", md: "auto" },
  marginInline: { xs: "auto", md: 0 },
  mt: { xs: 0, md: "-1.5rem" },
  mb: "-1.5rem",
} as const;

const artImageStyle = {
  width: "100%",
  maxWidth: 520,
  height: "auto",
  objectFit: "contain",
} as const;

export const EntertainmentHero = ({
  eyebrow,
  title,
  lead,
}: EntertainmentHeroProps) => {
  return (
    <HeroPanel tone="pale" sx={heroSx}>
      <Box sx={{ maxWidth: { xs: "none", md: 460 } }}>
        <SectionEyebrow label={eyebrow} />

        <Typography variant="h1" sx={titleSx}>
          {title}
        </Typography>

        <Typography sx={heroLeadSx}>{lead}</Typography>
      </Box>

      <Box sx={artSx}>
        <Image
          src={entertainmentHeroImage}
          alt={title}
          sizes="(max-width: 900px) 90vw, 520px"
          priority
          style={artImageStyle}
        />
      </Box>
    </HeroPanel>
  );
};

export type { EntertainmentHeroProps } from "./types";
