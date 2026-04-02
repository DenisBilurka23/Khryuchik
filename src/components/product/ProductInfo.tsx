"use client";

import { useState } from "react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useCart } from "../cart/store";
import { formatCurrency } from "@/utils";
import type { ProductInfoProps } from "./types";

export const ProductInfo = ({ locale, labels, product }: ProductInfoProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [language, setLanguage] = useState(product.languages?.[0]?.value || "");
  const [format, setFormat] = useState(product.formats?.[0]?.value || "");
  const [size, setSize] = useState(product.sizes?.[0]?.value || "");
  const [color, setColor] = useState(product.colors?.[0]?.value || "");

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
  };

  return (
    <Box>
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

      <Typography
        variant="h3"
        sx={{ mt: 2, fontSize: { xs: 32, md: 40 }, fontWeight: 800 }}
      >
        {product.title}
      </Typography>

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

      <Typography color="text.secondary" sx={{ mt: 3, lineHeight: 1.8 }}>
        {product.description}
      </Typography>

      <Stack spacing={2.5} sx={{ mt: 4 }}>
        {product.languages?.length ? (
          <TextField
            select
            label={labels.selectors.language}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            fullWidth
          >
            {product.languages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {product.formats?.length ? (
          <TextField
            select
            label={labels.selectors.format}
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
            label={labels.selectors.size}
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
            label={labels.selectors.color}
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

        <TextField
          label={labels.selectors.quantity}
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
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingBagOutlinedIcon />}
          sx={{ flex: 1 }}
          onClick={handleAddToCart}
        >
          {labels.actions.addToCart}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          sx={{ flex: 1, borderColor: "#E8D6BF", bgcolor: "#fff" }}
        >
          {labels.actions.buyNow}
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          {labels.details.sku}: {product.sku}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {labels.details.securePayment}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {labels.details.shipping}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {labels.details.languageSupport}
        </Typography>
      </Stack>
    </Box>
  );
};
