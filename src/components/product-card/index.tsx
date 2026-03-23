import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { formatCurrency } from "../utils";
import styles from "./product-card.module.css";
import type { ProductCardProps } from "./types";

export const ProductCard = ({
  product,
  locale,
  addToCart,
  wishlistAriaLabel,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <Card className={styles.card}>
      <CardContent sx={{ p: 2.5 }}>
        <Box className={styles.preview}>{product.emoji}</Box>

        <Typography variant="h6" sx={{ mt: 3, fontSize: 18, fontWeight: 700 }}>
          {product.title}
        </Typography>

        <Typography sx={{ mt: 1, color: "primary.main", fontWeight: 700 }}>
          {formatCurrency(product.price, locale)}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            className={styles.addButton}
            onClick={() => onAddToCart(product.id)}
          >
            {addToCart}
          </Button>

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
