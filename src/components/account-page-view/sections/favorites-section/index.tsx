import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";

import { SectionCard } from "../../shared";

import type { FavoritesSectionProps } from "./types";

export const FavoritesSection = ({
  locale,
  dictionary,
  favorites,
  favoriteSuggestions,
  favoriteCategories,
  favoritesInStockCount,
  favoritesTotal,
}: FavoritesSectionProps) => {
  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "32px",
          border: "1px solid #F0DFC8",
          background:
            "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.35), transparent 28%), #fff",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontSize: 13,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {dictionary.favoritesEyebrow}
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, fontSize: { xs: 30, md: 40 }, fontWeight: 800 }}>
              {dictionary.favoritesTitle}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 640, lineHeight: 1.8 }}>
              {dictionary.favoritesLead}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "24px",
                bgcolor: "#fff",
                border: "1px solid #F0DFC8",
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{dictionary.favoritesSavedLabel}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {favorites.length} {locale === "ru" ? "товара" : "items"}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{dictionary.favoritesInStockLabel}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {favoritesInStockCount} {locale === "ru" ? "товара" : "items"}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">{dictionary.favoritesTotalLabel}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{favoritesTotal}</Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <SectionCard
        title={dictionary.favoritesListTitle}
        action={
          <Button variant="contained" sx={{ width: { xs: "100%", sm: "auto" } }}>
            {dictionary.favoritesAddAllToCart}
          </Button>
        }
      >
        <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
          <Chip label={dictionary.favoritesFilterAll} sx={{ fontWeight: 700, bgcolor: "#FCE5EA" }} />
          {favoriteCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant="outlined"
              sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
            />
          ))}
        </Stack>

        <Grid container spacing={2.25}>
          {favorites.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "24px",
                  border: "1px solid #F0DFC8",
                  bgcolor: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    height: { xs: 180, sm: 160, md: 180 },
                    borderRadius: "20px",
                    bgcolor: "#FFF8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 54,
                    position: "relative",
                  }}
                >
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      bgcolor: "#fff",
                      fontWeight: 700,
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      minWidth: 38,
                      width: 38,
                      height: 38,
                      px: 0,
                      borderColor: "#E8D6BF",
                      bgcolor: "#fff",
                    }}
                  >
                    <FavoriteOutlinedIcon fontSize="small" />
                  </Button>
                  {item.emoji}
                </Box>

                <Stack spacing={1.25} sx={{ mt: 2, flex: 1 }}>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 20,
                        lineHeight: 1.25,
                        minHeight: "2.5em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.125 }}>
                      {item.subtitle}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={item.category}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
                    />
                    <Chip
                      label={item.availability}
                      size="small"
                      sx={{
                        bgcolor:
                          item.availabilityTone === "warning"
                            ? "#FFF3D6"
                            : item.availabilityTone === "preorder"
                              ? "#E8EEFF"
                              : "#E6F6EC",
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  <Box sx={{ mt: "auto" }}>
                    <Typography color="text.secondary" variant="body2">
                      {dictionary.favoritesPriceLabel}
                    </Typography>
                    <Typography sx={{ mt: 0.25, color: "primary.main", fontWeight: 800, fontSize: 22 }}>
                      {item.price}
                    </Typography>
                  </Box>

                  <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                    <Button fullWidth variant="contained">
                      {locale === "ru" ? "В корзину" : "Add to cart"}
                    </Button>
                    <Button fullWidth variant="outlined" color="inherit" sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}>
                      {dictionary.favoritesView}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title={dictionary.favoritesRecommendationsTitle}
        action={<Button variant="text">{dictionary.favoritesRecommendationsAction}</Button>}
      >
        <Grid container spacing={2}>
          {favoriteSuggestions.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: "22px",
                  border: "1px solid #F0DFC8",
                  bgcolor: "#fff",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    height: 140,
                    borderRadius: "18px",
                    bgcolor: "#FFF8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                  }}
                >
                  {item.emoji}
                </Box>
                <Typography sx={{ mt: 2, fontWeight: 700 }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.subtitle}
                </Typography>
                <Button variant="text" sx={{ mt: 1.5, px: 0 }} endIcon={<ChevronRightOutlinedIcon />}>
                  {dictionary.favoritesView}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </SectionCard>
    </Stack>
  );
};

export type { FavoritesSectionProps } from "./types";