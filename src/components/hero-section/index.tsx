import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { StorefrontDictionary } from "@/i18n/types";
import {
  formatCurrency,
  getCountryCurrency,
  getLocalizedPath,
  promoBackgrounds,
} from "@/utils";

import { InfoChip } from "../info-chip";
import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./types";

export const HeroSection = async ({ locale, country }: HeroSectionProps) => {
  const t = await getTranslations({ locale, namespace: "storefront.hero" });
  const chips = t.raw("chips") as StorefrontDictionary["hero"]["chips"];
  const featuredHit = t.raw(
    "featuredHit",
  ) as StorefrontDictionary["hero"]["featuredHit"];
  const character = t.raw(
    "character",
  ) as StorefrontDictionary["hero"]["character"];
  const newBook = t.raw("newBook") as StorefrontDictionary["hero"]["newBook"];
  const promos = t.raw("promos") as StorefrontDictionary["hero"]["promos"];
  const homeHref = getLocalizedPath(locale, "/");

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} className={styles.badge} sx={{ mb: 3 }}>
              <Typography variant="body2">{t("badge")}</Typography>
            </Paper>

            <Typography
              variant="h1"
              sx={{ maxWidth: 680, fontSize: { xs: 42, md: 64 } }}
            >
              {t("title")}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 3,
                maxWidth: 620,
                lineHeight: 1.8,
                fontSize: { xs: 16, md: 18 },
              }}
            >
              {t("lead")}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Link
                href={`${homeHref}#books`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button component="span" variant="contained" size="large">
                  {t("primaryAction")}
                </Button>
              </Link>
              <Link
                href={getLocalizedPath(locale, "/shop")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  component="span"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  className={styles.secondaryButton}
                >
                  {t("secondaryAction")}
                </Button>
              </Link>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              sx={{ mt: 4 }}
            >
              {chips.map((chip) => (
                <InfoChip key={chip} text={chip} />
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: "relative", maxWidth: 520, mx: "auto" }}>
              <Paper
                elevation={0}
                className={styles.featuredHit}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Typography variant="caption" color="text.secondary">
                  {featuredHit.label}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                  {featuredHit.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "primary.main" }}>
                  {formatCurrency(
                    featuredHit.price,
                    locale,
                    getCountryCurrency(country),
                  )}
                </Typography>
              </Paper>

              <Paper elevation={0} className={styles.heroCard} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    className={styles.characterPanel}
                    sx={{ p: { xs: 3, md: 4 } }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {character.eyebrow}
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          sx={{ fontSize: { xs: 64, md: 96 }, lineHeight: 1 }}
                        >
                          {character.emoji}
                        </Typography>
                        <Typography
                          sx={{ mt: 1, fontSize: 32, fontWeight: 800 }}
                        >
                          {character.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {character.subtitle}
                        </Typography>
                      </Box>

                      <Paper
                        elevation={0}
                        className={styles.newBookCard}
                        sx={{ display: { xs: "none", md: "block" }, p: 2 }}
                      >
                        <Box className={styles.newBookInner}>
                          <Typography sx={{ fontSize: 48 }}>
                            {newBook.emoji}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 1.5, fontWeight: 700 }}
                          >
                            {newBook.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {newBook.title}
                          </Typography>
                        </Box>
                      </Paper>
                    </Stack>
                  </Box>

                  <Grid container spacing={2}>
                    {promos.map((promo, index) => (
                      <Grid key={promo.title} size={{ xs: 12, md: 6 }}>
                        <Paper
                          elevation={0}
                          className={styles.promoCard}
                          sx={{
                            bgcolor:
                              promoBackgrounds[index % promoBackgrounds.length],
                            p: 3,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {promo.eyebrow}
                          </Typography>
                          <Typography
                            sx={{ mt: 0.5, fontSize: 20, fontWeight: 700 }}
                          >
                            {promo.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1.5, lineHeight: 1.7 }}
                          >
                            {promo.desc}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
