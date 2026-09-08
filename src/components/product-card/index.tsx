import { Box, Card, Typography } from "@mui/material";
import Link from "next/link";

import { displayFont } from "@/theme/sx";
import { formatCurrency, isPurchasableAvailability } from "@/utils";

import { ArrowLink } from "../arrow-link";
import { WishlistButton } from "./wishlist-button";
import type { ProductCardProps } from "./types";

const cardSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  p: 2.25,
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: { xs: "14px", md: "var(--radius-card)" },
  boxShadow: "0 6px 20px rgba(52, 39, 45, 0.035)",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    borderColor: "var(--color-border-rose)",
    boxShadow: "var(--shadow-card)",
  },
} as const;

const soldOutSx = {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  height: 32,
  paddingInline: 1.5,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-card)",
  background: "var(--color-cream)",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1,
  color: "var(--color-text-secondary)",
} as const;

const thumbnailSx = {
  aspectRatio: "16 / 9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: "13px",
  fontSize: 48,
} as const;

const titleSx = {
  mt: 1.75,
  fontFamily: displayFont,
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1.2,
  color: "var(--color-text)",
} as const;

const footerSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.5,
  mt: "auto",
  pt: 1.25,
} as const;

const wishlistSx = {
  p: 0,
  color: "var(--color-action)",
  "&:hover": {
    background: "transparent",
    color: "var(--color-action-hover)",
  },
  "&.MuiIconButton-colorPrimary": { color: "var(--color-accent)" },
  "& svg": { width: 22, height: 22 },
} as const;

export const ProductCard = ({
  product,
  locale,
  wishlistAriaLabel,
  outOfStock,
  viewProduct,
  detailsHref,
}: ProductCardProps) => {
  const thumbnail = product.thumbnail;
  const isSoldOut = !isPurchasableAvailability(product.availability);

  return (
    <Card sx={cardSx}>
      <Link href={detailsHref}>
        <Box sx={{ position: "relative", display: "block" }}>
          {isSoldOut ? (
            <Typography component="span" sx={soldOutSx}>
              {outOfStock}
            </Typography>
          ) : null}

          <Box
            sx={{
              ...thumbnailSx,
              background:
                thumbnail?.bgColor ??
                product.thumbnailBackgroundColor ??
                "var(--color-cream)",
            }}
          >
            {thumbnail?.src ? (
              <Box
                component="img"
                src={thumbnail.src}
                alt={thumbnail.alt ?? product.title}
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              (thumbnail?.emoji ?? product.emoji)
            )}
          </Box>
        </Box>
      </Link>

      <Link href={detailsHref}>
        <Typography component="p" sx={titleSx}>
          {product.title}
        </Typography>
      </Link>

      <Box sx={footerSx}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography
            component="p"
            sx={{ fontSize: 16, fontWeight: 600, color: "var(--color-accent)" }}
          >
            {formatCurrency(product.price, locale, product.currency)}
          </Typography>

          <ArrowLink href={detailsHref} label={viewProduct} size="sm" />
        </Box>

        <WishlistButton
          productId={product.id}
          label={`${wishlistAriaLabel}: ${product.title}`}
          sx={wishlistSx}
        />
      </Box>
    </Card>
  );
};

export type { ProductCardProps } from "./types";
