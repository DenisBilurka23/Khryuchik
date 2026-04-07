"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency, getLocalizedProductPath } from "@/utils";

import { useCart } from "../cart/store";

import type { FavoritesPageViewProps } from "./types";

const getAvailabilityLabel = (availability: string, locale: FavoritesPageViewProps["locale"]) => {
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

export const FavoritesPageContent = ({
  locale,
  storefrontDictionary,
  accountDictionary,
  categoryLabels,
  isAuthenticated: initialIsAuthenticated,
  shopHref,
  loginHref,
  registerHref,
}: FavoritesPageViewProps) => {
  const { addItem } = useCart();
  const { items, ids, isLoading, isAuthenticated, toggleWishlist } = useWishlist();
  const authState = isAuthenticated || initialIsAuthenticated;
  const resolvedItems = items.filter((item) => item.product);
  const inStockCount = resolvedItems.filter(
    (item) => item.product?.availability === "in_stock",
  ).length;
  const totalValue = resolvedItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0),
    0,
  );
  const guestCopy = storefrontDictionary.favoritesPage;
  const authCopy = accountDictionary;
  const totalCurrency = resolvedItems[0]?.product?.currency ?? "BYN";

  const getCategoryLabel = (categoryKey: string) =>
    categoryLabels[categoryKey] ?? categoryKey;

  const addAllToCart = () => {
    resolvedItems.forEach((item) => {
      addItem({
        productId: item.productId,
        quantity: 1,
      });
    });
  };

  const renderGuestActions = () => (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
        <Link href={loginHref} style={{ textDecoration: "none" }}>
          <Button variant="contained" size="large" startIcon={<LoginOutlinedIcon />}>
            {guestCopy.primaryAction}
          </Button>
        </Link>
        <Link href={registerHref} style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="inherit" size="large" startIcon={<PersonAddAltOutlinedIcon />} sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}>
            {guestCopy.secondaryAction}
          </Button>
        </Link>
      </Stack>

      <Link href={shopHref} style={{ textDecoration: "none", display: "inline-flex" }}>
        <Button variant="text" sx={{ mt: 1.5, px: 0 }} endIcon={<ChevronRightOutlinedIcon />}>
          {guestCopy.continueAction}
        </Button>
      </Link>
    </>
  );

  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "28px",
        border: "1px solid #F0DFC8",
        bgcolor: "#fff",
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
        {authState ? authCopy.favoritesTitle : guestCopy.listTitle}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
        {authState ? authCopy.favoritesLead : guestCopy.guestListText}
      </Typography>
      <Link href={shopHref} style={{ textDecoration: "none", display: "inline-flex" }}>
        <Button variant="contained" sx={{ mt: 3 }}>
          {authState ? authCopy.favoritesAddAllToCart : guestCopy.continueAction}
        </Button>
      </Link>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: "36px",
          border: "1px solid #F0DFC8",
          background:
            "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.35), transparent 28%), #fff",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              label={authState ? authCopy.favoritesEyebrow : guestCopy.eyebrow}
              sx={{ bgcolor: "#FCE5EA", fontWeight: 800 }}
            />
            <Typography variant="h1" sx={{ mt: 2, fontSize: { xs: 36, md: 58 } }}>
              {authState ? authCopy.favoritesTitle : guestCopy.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 720, lineHeight: 1.85, fontSize: { xs: 16, md: 18 } }}>
              {authState ? authCopy.favoritesLead : guestCopy.lead}
            </Typography>

            {authState ? (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
                <Button variant="contained" size="large" onClick={addAllToCart} disabled={resolvedItems.length === 0}>
                  {authCopy.favoritesAddAllToCart}
                </Button>
              </Stack>
            ) : (
              renderGuestActions()
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            {authState ? (
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.25, borderRadius: "22px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
                    <Typography color="text.secondary" variant="body2">
                      {authCopy.favoritesSavedLabel}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontWeight: 800, fontSize: 28 }}>
                      {ids.length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.25, borderRadius: "22px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
                    <Typography color="text.secondary" variant="body2">
                      {authCopy.favoritesInStockLabel}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontWeight: 800, fontSize: 28 }}>
                      {inStockCount}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2.25, borderRadius: "22px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
                    <Typography color="text.secondary" variant="body2">
                      {authCopy.favoritesTotalLabel}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontWeight: 800, fontSize: 28 }}>
                      {formatCurrency(totalValue, locale, totalCurrency)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ p: 2.5, borderRadius: "28px", bgcolor: "rgba(255,255,255,0.76)", border: "1px solid #F0DFC8" }}>
                <Typography color="text.secondary" variant="body2">
                  {guestCopy.savedLabel}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 800, fontSize: 26 }}>
                  {ids.length} {guestCopy.savedCountLabel}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 4.5 }}>
        {isLoading ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: "28px", border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
            <Typography color="text.secondary">
              {locale === "ru" ? "Загружаем избранное..." : "Loading wishlist..."}
            </Typography>
          </Paper>
        ) : resolvedItems.length === 0 ? (
          renderEmptyState()
        ) : (
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
                {resolvedItems.map((item) => {
                  const product = item.product;

                  if (!product) {
                    return null;
                  }

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
                            bgcolor: product.bgColor ?? "#FFF8F0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 54,
                            position: "relative",
                          }}
                        >
                          {product.merchandisingFlags[0] ? (
                            <Chip
                              label={product.merchandisingFlags[0]}
                              size="small"
                              sx={{ position: "absolute", top: 10, left: 10, bgcolor: "#fff", fontWeight: 700 }}
                            />
                          ) : null}
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                              void toggleWishlist(item.productId);
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
                                  addItem({ productId: item.productId, quantity: 1 });
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
                                    void toggleWishlist(item.productId);
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
                                  addItem({ productId: item.productId, quantity: 1 });
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
        )}
      </Box>
    </Container>
  );
};