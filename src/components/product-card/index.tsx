import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { formatCurrency } from "@/utils";
import { AddToCartButton } from "./AddToCartButton";
import styles from "./product-card.module.css";
import type { ProductCardProps } from "./types";

export const ProductCard = ({
  product,
  locale,
  addToCart,
  wishlistAriaLabel,
  detailsHref,
}: ProductCardProps) => {
  return (
    <Card className={styles.card}>
      <CardContent sx={{ p: 2.5 }}>
        <Link
          href={detailsHref}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <Box
            className={styles.preview}
            sx={{
              color: "inherit",
              display: "flex",
              bgcolor: product.bgColor ?? undefined,
            }}
          >
            {product.emoji}
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

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <AddToCartButton
            productId={product.id}
            label={addToCart}
            className={styles.addButton}
          />

          <IconButton
            aria-label={`${wishlistAriaLabel}: ${product.title}`}
            className={styles.wishlistButton}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};
