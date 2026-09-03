import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

import { ArrowLink } from "../arrow-link";
import { formatCurrency, isPurchasableAvailability } from "@/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";
import styles from "./product-card.module.css";
import type { ProductCardProps } from "./types";

export const ProductCard = ({
  product,
  locale,
  addToCart,
  wishlistAriaLabel,
  outOfStock,
  viewProduct,
  detailsHref,
}: ProductCardProps) => {
  const thumbnail = product.thumbnail;
  const isSoldOut = !isPurchasableAvailability(product.availability);
  const canAddDirectly = !isSoldOut && !product.hasOptions;

  return (
    <Card className={styles.card}>
      <CardContent
        sx={{
          p: 1.5,
          "&:last-child": { pb: 1.5 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Link
          href={detailsHref}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
            position: "relative",
          }}
        >
          {isSoldOut ? (
            <Chip
              label={outOfStock}
              size="small"
              className={styles.soldOutChip}
            />
          ) : null}
          <Box
            className={styles.preview}
            sx={{
              bgcolor:
                thumbnail?.bgColor ??
                product.thumbnailBackgroundColor ??
                undefined,
            }}
          >
            {thumbnail?.src ? (
              <Box
                component="img"
                src={thumbnail.src}
                alt={thumbnail.alt ?? product.title}
                className={styles.previewImage}
              />
            ) : (
              (thumbnail?.emoji ?? product.emoji)
            )}
          </Box>
        </Link>

        <Link
          href={detailsHref}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <Typography
            sx={{ mt: 1.75, fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}
          >
            {product.title}
          </Typography>
        </Link>

        <Typography sx={{ mt: 0.75, fontSize: 17, fontWeight: 700 }}>
          {formatCurrency(product.price, locale, product.currency)}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mt: "auto", pt: 1.5 }}
        >
          <ArrowLink href={detailsHref} label={viewProduct} />

          <Stack direction="row" spacing={0.5} alignItems="center">
            {canAddDirectly ? (
              <AddToCartButton
                productId={product.id}
                label={addToCart}
                className={styles.iconAction}
                iconOnly
              />
            ) : null}

            <WishlistButton
              productId={product.id}
              label={`${wishlistAriaLabel}: ${product.title}`}
              className={styles.iconAction}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
