import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { formatCurrency, getLocalizedProductPath } from "@/utils";

import type { FavoritesWishlistGridProps } from "./types";

const getAvailabilityLabel = (
  availability: string,
  locale: FavoritesWishlistGridProps["locale"],
) => {
  switch (availability) {
    case "preorder":
      return locale === "ru" ? "Предзаказ" : "Preorder";
    case "made_to_order":
      return locale === "ru" ? "Под заказ" : "Made to order";
    case "out_of_stock":
      return locale === "ru" ? "Нет в наличии" : "Out of stock";
    case "in_stock":
    default:
      return locale === "ru" ? "В наличии" : "In stock";
  }
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "preorder":
      return "#E8EEFF";
    case "made_to_order":
      return "#FFF3D6";
    case "out_of_stock":
      return "#FCE5EA";
    case "in_stock":
    default:
      return "#E6F6EC";
  }
};

export const FavoritesWishlistGrid = ({
  locale,
  authState,
  authCopy,
  guestCopy,
  accountDictionary,
  categoryLabels,
  items,
  onAddToCart,
  onToggleWishlist,
}: FavoritesWishlistGridProps) => {
  const getCategoryLabel = (categoryKey: string) =>
    categoryLabels[categoryKey] ?? categoryKey;

  return (
    <Card sx={{ border: "1px solid #F0DFC8" }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 800 }}>
              {authState ? authCopy.favoritesListTitle : guestCopy.listTitle}
            </Typography>
            {!authState ? (
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {guestCopy.guestListText}
              </Typography>
            ) : null}
          </Box>
        </Stack>

        <Grid container spacing={2.25}>
          {items.map((item) => {
            const product = item.product;
            const detailsHref = getLocalizedProductPath(locale, product.slug);

            return (
              <Grid key={item.productId} size={{ xs: 12, sm: 6, xl: 4 }}>
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
                      height: 180,
                      borderRadius: "20px",
                      bgcolor: product.thumbnailBackgroundColor ?? "#FFF8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 54,
                      position: "relative",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        void onToggleWishlist(item.productId);
                      }}
                      sx={{ position: "absolute", top: 10, right: 10, minWidth: 38, width: 38, height: 38, px: 0, borderColor: "#E8D6BF", bgcolor: "#fff" }}
                    >
                      <FavoriteOutlinedIcon fontSize="small" />
                    </Button>
                    {product.emoji}
                  </Box>

                  <Stack spacing={1.1} sx={{ mt: 2, flex: 1 }}>
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
                        {product.title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{
                          mt: 0.25,
                          minHeight: "3em",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.shortDescription}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={getCategoryLabel(product.category)} size="small" variant="outlined" sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }} />
                      <Chip
                        label={getAvailabilityLabel(product.availability, locale)}
                        size="small"
                        sx={{ bgcolor: getAvailabilityColor(product.availability), fontWeight: 700 }}
                      />
                    </Stack>

                    <Box sx={{ mt: "auto" }}>
                      <Typography color="text.secondary" variant="body2">
                        {accountDictionary.favoritesPriceLabel}
                      </Typography>
                      <Typography sx={{ color: "primary.main", fontWeight: 800, fontSize: 22 }}>
                        {formatCurrency(product.price, locale, product.currency)}
                      </Typography>
                    </Box>

                    {authState ? (
                      <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            onAddToCart(item.productId);
                          }}
                        >
                          {guestCopy.addToCart}
                        </Button>
                        <Stack direction="row" spacing={1.25}>
                          <Link href={detailsHref} style={{ textDecoration: "none", display: "flex", flex: 1 }}>
                            <Button fullWidth variant="outlined" color="inherit" startIcon={<VisibilityOutlinedIcon />} sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}>
                              {authCopy.favoritesView}
                            </Button>
                          </Link>
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                              void onToggleWishlist(item.productId);
                            }}
                            sx={{ minWidth: 44, px: 0, borderColor: "#E8D6BF", bgcolor: "#fff" }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </Button>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            onAddToCart(item.productId);
                          }}
                        >
                          {guestCopy.addToCart}
                        </Button>
                        <Link href={detailsHref} style={{ textDecoration: "none", display: "flex" }}>
                          <Button fullWidth variant="outlined" color="inherit" sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}>
                            {guestCopy.view}
                          </Button>
                        </Link>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export type { FavoritesWishlistGridProps, ResolvedWishlistItem } from "./types";