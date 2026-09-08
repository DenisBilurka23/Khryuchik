import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import heroImage from "@/assets/MainHeroTransparent.png";
import { ArrowLink } from "@/components/arrow-link";
import { SectionEyebrow } from "@/components/section-eyebrow";
import type { StorefrontDictionary } from "@/i18n/types";
import { displayFont } from "@/theme/sx";
import { getLocalizedPath } from "@/utils";

import type { HeroSectionProps } from "./types";

const leadSx = {
  maxWidth: 500,
  mt: 2.5,
  fontSize: 17,
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
} as const;

const actionSx = {
  whiteSpace: "nowrap",
  width: { xs: "100%", sm: "auto" },
} as const;

export const HeroSection = async ({ locale }: HeroSectionProps) => {
  const t = await getTranslations({ locale, namespace: "storefront.hero" });
  const character = t.raw(
    "character",
  ) as StorefrontDictionary["hero"]["character"];

  const homeHref = getLocalizedPath(locale, "/");
  const storyHref = getLocalizedPath(locale, "/story");

  return (
    <Box component="section" sx={{ py: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            minHeight: { xs: 0, md: 480 },
            p: { xs: "28px 20px", md: 5.5 },
            borderRadius: "var(--radius-hero)",
            background: "var(--color-hero)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                md: "minmax(300px, 5fr) minmax(0, 7fr)",
              },
              alignItems: "center",
              gap: { xs: 4, md: 6 },
              width: "100%",
            }}
          >
            <Box>
              <SectionEyebrow label={t("badge")} />

              <Typography variant="h1" sx={{ mt: 2.5 }}>
                {t("title")}
              </Typography>

              <Typography sx={leadSx}>{t("lead")}</Typography>

              <Typography sx={leadSx}>{t("leadSecondary")}</Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Link href={`${homeHref}#books`}>
                  <Button component="span" variant="contained" sx={actionSx}>
                    {t("primaryAction")}
                  </Button>
                </Link>

                <Link href={`${homeHref}#entertainment`}>
                  <Button
                    component="span"
                    variant="outlined"
                    sx={{ ...actionSx, background: "var(--color-card)" }}
                  >
                    {t("secondaryAction")}
                  </Button>
                </Link>
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                maxWidth: { xs: 560, md: "none" },
                marginInline: { xs: "auto", md: 0 },
                mb: { xs: 0, md: 6 },
              }}
            >
              <Image
                src={heroImage}
                alt={character.title}
                sizes="(max-width: 900px) 100vw, 700px"
                priority
                style={{ display: "block", width: "100%", height: "auto" }}
              />

              <Box
                sx={{
                  position: { xs: "static", md: "absolute" },
                  right: 0,
                  top: "72%",
                  zIndex: 2,
                  width: { xs: "auto", md: "min(420px, 92%)" },
                  mt: { xs: 3, md: 0 },
                  p: 3,
                  borderRadius: "var(--radius-plate)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  boxShadow: "var(--shadow-floating)",
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    fontFamily: displayFont,
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {character.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {character.text}
                </Typography>

                <ArrowLink
                  href={storyHref}
                  label={character.actionLabel}
                  sx={{ mt: 2 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
