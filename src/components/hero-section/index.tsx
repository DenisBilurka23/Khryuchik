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

import { getCountryCurrency } from "@/shared/countries";

import { InfoChip } from "../info-chip";
import { formatCurrency, getLocalizedPath, promoBackgrounds } from "../utils";
import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./types";

export const HeroSection = ({ locale, country, dictionary }: HeroSectionProps) => {
  const homeHref = getLocalizedPath(locale, "/");

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} className={styles.badge} sx={{ mb: 3 }}>
              <Typography variant="body2">{dictionary.hero.badge}</Typography>
            </Paper>

            <Typography
              variant="h1"
              sx={{ maxWidth: 680, fontSize: { xs: 42, md: 64 } }}
            >
              {dictionary.hero.title}
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
              {dictionary.hero.lead}
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
                  {dictionary.hero.primaryAction}
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
                  {dictionary.hero.secondaryAction}
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
              {dictionary.hero.chips.map((chip) => (
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
                  {dictionary.hero.featuredHit.label}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                  {dictionary.hero.featuredHit.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "primary.main" }}>
                  {formatCurrency(
                    dictionary.hero.featuredHit.price,
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
                      {dictionary.hero.character.eyebrow}
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
                          {dictionary.hero.character.emoji}
                        </Typography>
                        <Typography
                          sx={{ mt: 1, fontSize: 32, fontWeight: 800 }}
                        >
                          {dictionary.hero.character.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {dictionary.hero.character.subtitle}
                        </Typography>
                      </Box>

                      <Paper
                        elevation={0}
                        className={styles.newBookCard}
                        sx={{ display: { xs: "none", md: "block" }, p: 2 }}
                      >
                        <Box className={styles.newBookInner}>
                          <Typography sx={{ fontSize: 48 }}>
                            {dictionary.hero.newBook.emoji}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 1.5, fontWeight: 700 }}
                          >
                            {dictionary.hero.newBook.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dictionary.hero.newBook.title}
                          </Typography>
                        </Box>
                      </Paper>
                    </Stack>
                  </Box>

                  <Grid container spacing={2}>
                    {dictionary.hero.promos.map((promo, index) => (
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
