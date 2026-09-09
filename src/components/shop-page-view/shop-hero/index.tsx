import { Box, Typography } from "@mui/material";
import Image from "next/image";

import shopHeroImage from "@/assets/StoreHero.png";
import { HeroPanel } from "@/components/primitives";
import { SectionEyebrow } from "@/components/section-eyebrow";

import type { ShopHeroProps } from "./types";

const fadeToLeft = "linear-gradient(to right, transparent 0, #000 48px)";

const edgeFade =
  "linear-gradient(to right, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%), " +
  "linear-gradient(to bottom, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)";

const heroSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 45fr) minmax(0, 55fr)",
    xl: "minmax(0, 38fr) minmax(0, 62fr)",
  },
  alignItems: "center",
  gap: { xs: 3, xl: 4 },
  minHeight: { xs: 0, md: 360 },
  p: { xs: "24px 20px", md: 5 },
  borderRadius: { xs: "20px", md: "var(--radius-hero)" },
} as const;

const titleSx = {
  mt: 2.5,
  fontSize: { xs: 38, md: "clamp(30px, 3.8vw, 48px)" },
  lineHeight: 1.06,
} as const;

const leadSx = {
  mt: 2.25,
  fontSize: { xs: 16, md: 18 },
  lineHeight: 1.65,
  color: "var(--color-text)",
} as const;

const artSx = {
  position: "relative",
  alignSelf: { xs: "auto", md: "stretch" },
  minHeight: { xs: 0, md: 280 },
  aspectRatio: { xs: "16 / 10", md: "auto" },
  margin: { xs: "0 -20px -24px", md: "-60px -40px -60px 0" },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "0 var(--radius-hero) var(--radius-hero) 0",
    background:
      "linear-gradient(to bottom, transparent 0, var(--color-hero-rose) 20px, var(--color-hero-rose) calc(100% - 20px), transparent 100%)",
    WebkitMaskImage: fadeToLeft,
    maskImage: fadeToLeft,
  },
} as const;

export const ShopHero = ({ eyebrow, title, lead }: ShopHeroProps) => {
  return (
    <HeroPanel sx={heroSx}>
      <Box sx={{ maxWidth: { xs: "none", md: 460 } }}>
        <SectionEyebrow label={eyebrow} />

        <Typography variant="h1" sx={titleSx}>
          {title}
        </Typography>

        <Typography sx={leadSx}>{lead}</Typography>
      </Box>

      <Box sx={artSx}>
        <Image
          src={shopHeroImage}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 55vw, 760px"
          priority
          style={{
            objectFit: "cover",
            objectPosition: "center 45%",
            borderRadius: 48,
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

export type { ShopHeroProps } from "./types";
