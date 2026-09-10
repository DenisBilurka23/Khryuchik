import { Box, Typography } from "@mui/material";
import Image from "next/image";

import accountHeroImage from "@/assets/AccountHero.png";
import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";

import type { AccountHeroProps } from "./types";

const heroSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1.5fr) minmax(0, 1fr)",
  },
  alignItems: "center",
  gap: { xs: 3, md: 2 },
  minHeight: { xs: 0, md: 280 },
  p: { xs: "28px 22px", md: "44px 48px" },
  height: "100%",
  width: "100%",
  boxShadow: "var(--shadow-panel)",
} as const;

const contentSx = {
  minWidth: 0,
} as const;

const titleSx = {
  mt: 2,
  fontSize: "clamp(32px, 3.6vw, 48px)",
} as const;

const leadTextSx = {
  maxWidth: "48ch",
  mt: 2,
  fontSize: { xs: 16, md: 17 },
  lineHeight: 1.65,
  color: "var(--color-text)",
} as const;

const artSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: { xs: "center", md: "flex-end" },
  minWidth: 0,
  width: { xs: "min(90%, 400px)", md: "auto" },
  marginInline: { xs: "auto", md: 0 },
} as const;

const artImageStyle = {
  width: "100%",
  maxWidth: 440,
  height: "auto",
  objectFit: "contain",
} as const;

export const AccountHero = ({ eyebrow, title, lead }: AccountHeroProps) => {
  return (
    <HeroPanel tone="pale" sx={heroSx}>
      <Box sx={contentSx}>
        <SectionEyebrow label={eyebrow} />

        <Typography variant="h1" sx={titleSx}>
          {title}
        </Typography>

        <Typography sx={leadTextSx}>{lead}</Typography>
      </Box>

      <Box sx={artSx}>
        <Image
          src={accountHeroImage}
          alt={title}
          sizes="(max-width: 900px) 90vw, 440px"
          priority
          style={artImageStyle}
        />
      </Box>
    </HeroPanel>
  );
};

export type { AccountHeroProps } from "./types";
