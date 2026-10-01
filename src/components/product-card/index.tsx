import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { cardFrameSx, displayFont } from "@/theme/sx";
import { formatCurrency, isPurchasableAvailability } from "@/utils";

import { ArrowLink } from "@/components/arrow-link";
import {
  LinkPendingOverlay,
  LinkPendingProvider,
  LinkPendingSignal,
} from "@/components/link-pending";
import { WishlistButton } from "./wishlist-button";
import type { ProductCardProps } from "./types";

const thumbnailSizes =
  "(max-width: 599px) 100vw, (max-width: 899px) 50vw, 400px";

const cardSx = {
  ...cardFrameSx,
  p: 2.25,
  borderRadius: { xs: "14px", md: "var(--radius-card)" },
  boxShadow: "var(--shadow-card-soft)",
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
  position: "relative",
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
  eager = false,
}: ProductCardProps) => {
  const thumbnail = product.thumbnail;
  const isSoldOut = !isPurchasableAvailability(product.availability);

  return (
    <LinkPendingProvider>
      <Box sx={cardSx}>
        <Link href={detailsHref}>
          <LinkPendingSignal />
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
                <Image
                  src={thumbnail.src}
                  alt={thumbnail.alt ?? product.title}
                  fill
                  sizes={thumbnailSizes}
                  loading={eager ? "eager" : "lazy"}
                  style={{ objectFit: "contain" }}
                />
              ) : (
                (thumbnail?.emoji ?? product.emoji)
              )}

              <LinkPendingOverlay />
            </Box>
          </Box>
        </Link>

        <Link href={detailsHref}>
          <LinkPendingSignal />
          <Typography component="p" sx={titleSx}>
            {product.title}
          </Typography>
        </Link>

        <Box sx={footerSx}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <Typography
              component="p"
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-accent)",
              }}
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
      </Box>
    </LinkPendingProvider>
  );
};

export type { ProductCardProps } from "./types";
