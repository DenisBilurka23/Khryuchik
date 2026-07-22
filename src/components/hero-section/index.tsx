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
  getLatestBookSummary,
  getProductSummariesByIds,
} from "@/server/catalog/services/catalog.service";
import { getHeroContent } from "@/server/home-content/home-content.service";
import { getLocalizedPath } from "@/utils";

import { InfoChip } from "../info-chip";
import styles from "./hero-section.module.css";
import type { HeroSectionProps } from "./types";
import { buildHeroCards } from "./utils";

export const HeroSection = async ({
  locale,
  country,
  currency,
}: HeroSectionProps) => {
  const t = await getTranslations({ locale, namespace: "storefront.hero" });
  const chips = t.raw("chips") as StorefrontDictionary["hero"]["chips"];
  const character = t.raw(
    "character",
  ) as StorefrontDictionary["hero"]["character"];

  const heroContent = await getHeroContent();
  const orderedIds = [
    heroContent?.featuredProductId,
    heroContent?.newBookProductId,
  ].filter((id): id is string => Boolean(id));
  const linkedProducts =
    orderedIds.length > 0
      ? await getProductSummariesByIds(locale, country, [...new Set(orderedIds)])
      : [];
  const productById = new Map(
    linkedProducts.map((product) => [product.id, product]),
  );

  const featuredProduct = heroContent?.featuredProductId
    ? productById.get(heroContent.featuredProductId)
    : undefined;

  // The "new book" card falls back to the latest added book when no product is
  // pinned in the admin (or the pinned one is no longer active).
  const pinnedNewBook = heroContent?.newBookProductId
    ? productById.get(heroContent.newBookProductId)
    : undefined;
  const newBookProduct =
    pinnedNewBook ?? (await getLatestBookSummary(locale, country)) ?? undefined;

  const cards = buildHeroCards({
    locale,
    currency,
    fallback: {
      featuredHit: t.raw(
        "featuredHit",
      ) as StorefrontDictionary["hero"]["featuredHit"],
      newBook: t.raw("newBook") as StorefrontDictionary["hero"]["newBook"],
    },
    featuredProduct,
    newBookProduct,
  });

  const homeHref = getLocalizedPath(locale, "/");

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="flex-start">
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
              direction="row"
              spacing={2}
              sx={{
                mt: 4,
                "& > *": { flex: { xs: 1, sm: "0 0 auto" } },
              }}
            >
              <Link
                href={`${homeHref}#books`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  component="span"
                  variant="contained"
                  size="large"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
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
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {t("secondaryAction")}
                </Button>
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                mt: { md: 6 },
                maxWidth: { sm: 520 },
                ml: { sm: "auto" },
                mr: { sm: "auto", md: 0 },
              }}
            >
              <Paper
                elevation={0}
                className={styles.featuredHit}
                sx={{
                  display: { xs: "none", md: "block" },
                  textDecoration: "none",
                  color: "inherit",
                }}
                {...(cards.featured.href
                  ? { component: "a" as const, href: cards.featured.href }
                  : {})}
              >
                <Typography variant="caption" color="text.secondary">
                  {cards.featured.label}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                  {cards.featured.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "primary.main" }}>
                  {cards.featured.price}
                </Typography>
              </Paper>

              <Paper elevation={0} className={styles.heroCard} sx={{ p: 3 }}>
                <Box
                  className={styles.characterPanel}
                  sx={{ p: 2.5 }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={{ xs: 2, sm: 4 }}
                    alignItems={{ xs: "center", sm: "flex-start" }}
                  >
                    <Box sx={{ alignSelf: { sm: "flex-end" } }}>
                      <Stack
                        direction={{ xs: "row", sm: "column" }}
                        spacing={{ xs: 2, sm: 0 }}
                        alignItems={{ xs: "center", sm: "flex-start" }}
                      >
                        <Typography
                          sx={{ fontSize: { xs: 60, md: 72 }, lineHeight: 1 }}
                        >
                          {character.emoji}
                        </Typography>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: { xs: 0, sm: 2 } }}
                          >
                            {character.eyebrow}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: { xs: 22, md: 24 },
                              fontWeight: 800,
                            }}
                          >
                            {character.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {character.subtitle}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Paper
                      elevation={0}
                      className={styles.newBookCard}
                      sx={{
                        p: 2.5,
                        width: { xs: "100%", sm: 216 },
                        textAlign: "center",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      {...(cards.newBook.href
                        ? { component: "a" as const, href: cards.newBook.href }
                        : {})}
                    >
                      {cards.newBook.imageSrc ? (
                        <Box
                          component="img"
                          src={cards.newBook.imageSrc}
                          alt={cards.newBook.imageAlt ?? cards.newBook.caption}
                          sx={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                            borderRadius: "12px",
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: 76 }}>
                          {cards.newBook.emoji}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ mt: 1.5, fontWeight: 700 }}
                      >
                        {cards.newBook.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cards.newBook.caption}
                      </Typography>
                    </Paper>
                  </Stack>
                </Box>
              </Paper>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              sx={{
                mt: 4,
                justifyContent: { sm: "center", md: "flex-start" },
                maxWidth: { md: 520 },
                ml: { md: "auto" },
                mr: { md: 0 },
              }}
            >
              {chips.map((chip) => (
                <InfoChip key={chip} text={chip} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
