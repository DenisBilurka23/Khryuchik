import { Box, Typography } from "@mui/material";
import Image from "next/image";

import contactHeroImage from "@/assets/ContactsHero.png";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { accentSx } from "@/theme/sx";

import type { ContactHeroProps } from "./types";

const fadeFromTop = "linear-gradient(to bottom, transparent 0, #000 48px)";

export const ContactHero = ({
  eyebrow,
  titlePrefix,
  titleAccent,
  lede,
}: ContactHeroProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        overflow: "hidden",
        borderRadius: {
          xs: "var(--radius-panel)",
          md: "var(--radius-hero)",
        },
        background: "var(--color-hero-rose)",
      }}
    >
      <Box
        sx={{
          zIndex: 1,
          gridArea: { xs: "auto", md: "1 / 1" },
          alignSelf: "center",
          justifySelf: { xs: "stretch", md: "center" },
          maxWidth: { xs: "none", md: 580 },
          marginRight: { xs: 0, md: "10%", lg: "16%" },
          padding: { xs: "32px 20px 0", md: "40px 32px", lg: 6 },
          textAlign: "center",
        }}
      >
        <SectionEyebrow label={eyebrow} sx={{ justifyContent: "center" }} />

        <Typography variant="h1" sx={{ mt: 3 }}>
          {titlePrefix}{" "}
          <Box component="em" sx={{ display: "block", ...accentSx }}>
            {titleAccent}
          </Box>
        </Typography>

        <Typography
          sx={{
            maxWidth: 570,
            margin: "28px auto 0",
            fontSize: { xs: 16, md: 17 },
            lineHeight: 1.65,
            color: "var(--color-text)",
          }}
        >
          {lede}
        </Typography>
      </Box>

      <Box
        sx={{
          gridArea: { xs: "auto", md: "1 / 1" },
          alignSelf: "end",
          minWidth: 0,
          "& img": {
            WebkitMaskImage: { xs: "none", md: fadeFromTop },
            maskImage: { xs: "none", md: fadeFromTop },
          },
        }}
      >
        <Image
          src={contactHeroImage}
          alt=""
          aria-hidden
          sizes="(max-width: 767px) 100vw, 1280px"
          priority
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
    </Box>
  );
};

export type { ContactHeroProps } from "./types";
