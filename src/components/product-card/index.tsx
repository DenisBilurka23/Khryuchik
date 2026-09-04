import { Box, Card, Typography } from "@mui/material";
import Link from "next/link";

import { formatCurrency, isPurchasableAvailability } from "@/utils";

import { ArrowLink } from "../arrow-link";
import styles from "./product-card.module.css";
import { WishlistButton } from "./wishlist-button";
import type { ProductCardProps } from "./types";

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
    <Card className={styles.card}>
      <Link href={detailsHref} className={styles.previewLink}>
        {isSoldOut ? (
          <Typography component="span" className={styles.soldOutChip}>
            {outOfStock}
          </Typography>
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

      <Link href={detailsHref}>
        <Typography component="p" className={styles.title}>
          {product.title}
        </Typography>
      </Link>

      <Box className={styles.meta}>
        <Box className={styles.metaText}>
          <Typography component="p" className={styles.price}>
            {formatCurrency(product.price, locale, product.currency)}
          </Typography>

          <ArrowLink href={detailsHref} label={viewProduct} size="sm" />
        </Box>

        <WishlistButton
          productId={product.id}
          label={`${wishlistAriaLabel}: ${product.title}`}
          className={styles.wishlist}
        />
      </Box>
    </Card>
  );
};

export type { ProductCardProps } from "./types";
