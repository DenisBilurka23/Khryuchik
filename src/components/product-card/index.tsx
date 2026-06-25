import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { formatCurrency } from "@/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";
import styles from "./product-card.module.css";
import type { ProductCardProps } from "./types";

export const ProductCard = ({
  product,
  locale,
  addToCart,
  selectOptions,
  wishlistAriaLabel,
  detailsHref,
}: ProductCardProps) => {
  const thumbnail = product.thumbnail;

  return (
    <Card className={styles.card}>
      <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
        <Link
          href={detailsHref}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <Box
            className={styles.preview}
            sx={{
              color: "inherit",
              display: "flex",
              bgcolor:
                thumbnail?.bgColor ?? product.thumbnailBackgroundColor ?? undefined,
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
              thumbnail?.emoji ?? product.emoji
            )}
          </Box>
        </Link>

        <Link
          href={detailsHref}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              fontSize: 18,
              fontWeight: 700,
              color: "inherit",
            }}
          >
            {product.title}
          </Typography>
        </Link>

        <Typography sx={{ mt: 1, color: "primary.main", fontWeight: 700 }}>
          {formatCurrency(product.price, locale, product.currency)}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mt: "auto", pt: 3 }}>
          {product.hasOptions ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              href={detailsHref}
            >
              {selectOptions}
            </Button>
          ) : (
            <AddToCartButton
              productId={product.id}
              label={addToCart}
              className={styles.addButton}
            />
          )}

          <WishlistButton
            productId={product.id}
            label={`${wishlistAriaLabel}: ${product.title}`}
            className={styles.wishlistButton}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
