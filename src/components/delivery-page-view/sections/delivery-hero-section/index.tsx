import { Box, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { accentSx } from "@/theme/sx";
import { getCountryDisplayName } from "@/utils";

import { RegionMap } from "./region-map";
import type { DeliveryHeroSectionProps } from "./types";

const heroSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(0, 340px)",
    lg: "minmax(0, 1fr) minmax(0, 380px)",
  },
  alignItems: "center",
  gap: { xs: 3.5, md: 4, lg: 6 },
  p: { xs: "28px 20px", md: "28px 32px", lg: "32px 40px" },
  borderRadius: { xs: "var(--radius-panel)", md: "var(--radius-hero)" },
  background: "var(--color-hero-rose)",
} as const;

const ledeSx = {
  maxWidth: "52ch",
  mt: 2.25,
  fontSize: 17,
  lineHeight: 1.65,
  color: "var(--color-text)",
} as const;

const chipSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  padding: "0 14px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-card)",
  fontSize: 13,
  color: "var(--color-text-secondary)",
} as const;

const dotSx = {
  flexShrink: 0,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-action)",
} as const;

const mapFrameSx = {
  position: "relative",
  justifySelf: { xs: "stretch", lg: "end" },
  overflow: "hidden",
  width: "100%",
  maxWidth: { xs: "none", sm: 520, lg: 380 },
  aspectRatio: "320 / 260",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-card)",
} as const;

export const DeliveryHeroSection = ({
  eyebrow,
  title,
  lede,
  highlights,
  options,
  mapBadgeLabel,
  mapCity,
  locale,
  country,
}: DeliveryHeroSectionProps) => {
  const activeCountryLabel =
    options[country]?.country ?? getCountryDisplayName(locale, country);

  return (
    <Box component="section" sx={{ pt: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={heroSx}>
          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography
              variant="h1"
              sx={{ mt: 2.5, fontSize: "clamp(34px, 3.4vw, 46px)" }}
            >
              {title.lines.map((line) => (
                <Box component="span" key={line} sx={{ display: "block" }}>
                  {line}
                </Box>
              ))}
              <Box component="span" sx={{ display: "block", ...accentSx }}>
                {title.accent}
              </Box>
            </Typography>

            <Typography sx={ledeSx}>{lede}</Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mt: 3 }}>
              {highlights.map((highlight) => (
                <Box key={highlight} sx={{ ...chipSx, minHeight: 34 }}>
                  <Box
                    component="span"
                    aria-hidden
                    sx={{ ...dotSx, width: 6, height: 6 }}
                  />
                  {highlight}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={mapFrameSx}>
            <RegionMap country={country} city={mapCity} />

            <Box
              sx={{
                ...chipSx,
                position: "absolute",
                bottom: 16,
                left: 16,
                minHeight: 36,
              }}
            >
              <Box
                component="span"
                aria-hidden
                sx={{ ...dotSx, width: 8, height: 8 }}
              />
              {mapBadgeLabel}{" "}
              <Box
                component="strong"
                sx={{ fontWeight: 600, color: "var(--color-text)" }}
              >
                {activeCountryLabel}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryHeroSectionProps } from "./types";
