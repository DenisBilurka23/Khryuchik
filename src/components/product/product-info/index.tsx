"use client";

import { useState } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatCurrency, getLocalizedPath } from "@/utils";

import { useWishlist } from "@/hooks/useWishlist";
import { BOOK_FORMAT } from "@/constants/catalog";
import { useCart } from "../../cart/store";
import { setBuyNowItem } from "../../cart/buy-now-store";
import type { ProductInfoProps } from "../types";

export const ProductInfo = ({
  locale,
  product,
  ownedLanguages = [],
}: ProductInfoProps) => {
  const tProductPage = useTranslations("storefront.productPage");
  const tShopSection = useTranslations("storefront.shopSection");
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [language, setLanguage] = useState(product.languages?.[0]?.value || "");
  const [format, setFormat] = useState(product.formats?.[0]?.value || "");
  const [size, setSize] = useState(product.sizes?.[0]?.value || "");
  const [color, setColor] = useState(product.colors?.[0]?.value || "");
  const [toastOpen, setToastOpen] = useState(false);
  const isWishlisted = isInWishlist(product.productId);
  const hasMetaChips = Boolean(product.badge || product.storyLabel);
  const isDigital = format === BOOK_FORMAT.digital;
  const alreadyOwned = isDigital && ownedLanguages.includes(language);

  const handleAddToCart = () => {
    addItem({
      productId: product.productId,
      quantity,
      selections: {
        language: language || undefined,
        format: format || undefined,
        size: size || undefined,
        color: color || undefined,
      },
    });
    setToastOpen(true);
  };

  const handleBuyNow = () => {
    setBuyNowItem({
      productId: product.productId,
      quantity: isDigital ? 1 : quantity,
      selections: {
        language: language || undefined,
        format: format || undefined,
        size: size || undefined,
        color: color || undefined,
      },
    });
    router.push(getLocalizedPath(locale, "/checkout?buyNow=1"));
  };

  return (
    <Box>
      {hasMetaChips ? (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {product.badge ? (
            <Chip
              label={product.badge}
              color="secondary"
              sx={{ fontWeight: 700 }}
            />
          ) : null}
          {product.storyLabel ? (
            <Chip
              label={product.storyLabel}
              variant="outlined"
              sx={{ borderColor: "#E8D6BF" }}
            />
          ) : null}
        </Stack>
      ) : null}

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        sx={{ mt: 2 }}
      >
        <Typography
          variant="h3"
          sx={{ flex: 1, fontSize: { xs: 32, md: 40 }, fontWeight: 800 }}
        >
          {product.title}
        </Typography>
        <IconButton
          aria-label={`${tShopSection("wishlistAriaLabel")}: ${product.title}`}
          color={isWishlisted ? "primary" : "default"}
          onClick={() => {
            void toggleWishlist(product.productId);
          }}
          sx={{
            border: "1px solid #E8D6BF",
            bgcolor: "#fff",
            mt: 0.5,
          }}
        >
          {isWishlisted ? (
            <FavoriteOutlinedIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>
      </Stack>

      <Typography
        color="text.secondary"
        sx={{ mt: 1, fontSize: 18, lineHeight: 1.7 }}
      >
        {product.subtitle}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Typography
          sx={{ fontSize: 32, fontWeight: 800, color: "primary.main" }}
        >
          {formatCurrency(product.price, locale, product.currency)}
        </Typography>
        {product.oldPrice ? (
          <Typography
            sx={{
              fontSize: 18,
              color: "text.secondary",
              textDecoration: "line-through",
            }}
          >
            {formatCurrency(product.oldPrice, locale, product.currency)}
          </Typography>
        ) : null}
      </Stack>

      <Stack spacing={2.5} sx={{ mt: 4 }}>
        {product.languages?.length ? (
          <TextField
            select
            label={tProductPage("selectors.language")}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            fullWidth
            slotProps={{ select: { sx: { textTransform: "capitalize" } } }}
          >
            {product.languages.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ textTransform: "capitalize" }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {product.formats?.length ? (
          <TextField
            select
            label={tProductPage("selectors.format")}
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            fullWidth
          >
            {product.formats.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {product.sizes?.length ? (
          <TextField
            select
            label={tProductPage("selectors.size")}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            fullWidth
          >
            {product.sizes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {product.colors?.length ? (
          <TextField
            select
            label={tProductPage("selectors.color")}
            value={color}
            onChange={(event) => setColor(event.target.value)}
            fullWidth
          >
            {product.colors.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {!isDigital ? (
          <TextField
            label={tProductPage("selectors.quantity")}
            type="number"
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value) || 1))
            }
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
            fullWidth
          />
        ) : null}
      </Stack>

      {alreadyOwned ? (
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Alert icon={<CheckCircleOutlinedIcon />} severity="success">
            {tProductPage("actions.alreadyOwned")}
          </Alert>
          <Button
            component={Link}
            href={getLocalizedPath(locale, "/account?section=books")}
            variant="contained"
            size="large"
            startIcon={<MenuBookOutlinedIcon />}
            fullWidth
          >
            {tProductPage("actions.viewInLibrary")}
          </Button>
        </Stack>
      ) : (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{ flex: 1 }}
            onClick={handleAddToCart}
          >
            {tProductPage("actions.addToCart")}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ flex: 1, borderColor: "#E8D6BF", bgcolor: "#fff" }}
            onClick={handleBuyNow}
          >
            {tProductPage("actions.buyNow")}
          </Button>
        </Stack>
      )}

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {tProductPage("actions.addedToCart")}
        </Alert>
      </Snackbar>
    </Box>
  );
};
