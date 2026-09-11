import { Box, Typography } from "@mui/material";
import Image from "next/image";

import entertainmentHeroImage from "@/assets/KhryuchikAdventures.png";
import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";

import type { EntertainmentHeroProps } from "./types";

const edgeFade =
  "linear-gradient(to right, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%), " +
  "linear-gradient(to bottom, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)";

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
  position: "relative",
  alignSelf: { xs: "auto", md: "stretch" },
  minHeight: { xs: 0, md: 260 },
  aspectRatio: { xs: "16 / 10", md: "auto" },
  margin: { xs: "0 -20px -24px", md: "-40px -40px -40px 0" },
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
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 52vw, 700px"
          priority
          style={{
            objectFit: "contain",
            objectPosition: "center",
            WebkitMaskImage: edgeFade,
            maskImage: edgeFade,
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        />
      </Box>
    </HeroPanel>
  );
};

export type { EntertainmentHeroProps } from "./types";
