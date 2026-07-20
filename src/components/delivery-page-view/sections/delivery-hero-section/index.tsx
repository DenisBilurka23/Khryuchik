import { Box, Chip, Container, Typography } from "@mui/material";
import { RegionToggle } from "../region-toggle";
import { RegionMap } from "./region-map";
import type { DeliveryHeroSectionProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

export const DeliveryHeroSection = ({
  eyebrow,
  title,
  toggleAriaLabel,
  options,
  mapBadgeLabel,
  mapCity,
  locale,
  country,
  availableCountries,
  accent,
  heroGradient,
}: DeliveryHeroSectionProps) => {
  const activeOption = options[country];

  return (
    <Box
      component="section"
      sx={{ pt: { xs: 4, md: 7 }, pb: { xs: 3, md: 4 } }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 3.5, md: 8 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            gap: { xs: 4, md: 6 },
            position: "relative",
            overflow: "hidden",
            background: heroGradient,
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Chip
              label={eyebrow}
              sx={{
                backgroundColor: "rgba(255,255,255,0.6)",
                color: accent,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                mb: 3,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontFamily: serif,
                fontWeight: 500,
                fontSize: { xs: 40, md: 60 },
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
                mb: 2.5,
              }}
            >
              {title.lines.map((line) => (
                <Box component="span" key={line} sx={{ display: "block" }}>
                  {line}
                </Box>
              ))}
              <Box
                component="span"
                sx={{ display: "block", fontStyle: "italic", color: accent }}
              >
                {title.accent}
              </Box>
            </Typography>

            <RegionToggle
              country={country}
              locale={locale}
              availableCountries={availableCountries}
              accent={accent}
              toggleAriaLabel={toggleAriaLabel}
              options={options}
            />
          </Box>

          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              width: "100%",
              aspectRatio: "320 / 260",
              minHeight: { xs: 240, md: 320 },
              backgroundColor: "#fff",
              boxShadow: "0 16px 40px rgba(42,37,34,0.07)",
              overflow: "hidden",
            }}
          >
            <RegionMap country={country} city={mapCity} />
            <Chip
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: accent,
                  }}
                />
              }
              label={
                <Box component="span">
                  {mapBadgeLabel}{" "}
                  <Box component="strong" sx={{ fontWeight: 700 }}>
                    {activeOption.country}
                  </Box>
                </Box>
              }
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                backgroundColor: "#fff",
                color: "text.secondary",
                fontSize: 13,
                boxShadow:
                  "0 1px 2px rgba(42,37,34,0.04), 0 4px 14px rgba(42,37,34,0.04)",
                "& .MuiChip-icon": { ml: 1 },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryHeroSectionProps } from "./types";
