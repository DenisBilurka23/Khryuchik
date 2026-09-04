import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import type { CSSProperties } from "react";

import {
  formatCurrency,
  getLocalizedProductPath,
  isPurchasableAvailability,
} from "@/utils";

import type { CartItemCardProps } from "../types";

import styles from "./cart-item-card.module.css";

export const CartItemCard = ({
  item,
  locale,
  variantLabel,
  removeLabel,
  soldOutLabel,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemCardProps) => {
  const productHref = getLocalizedProductPath(locale, item.slug);
  const isSoldOut = !isPurchasableAvailability(item.availability);

  return (
    <Card className={styles.card}>
      <CardContent className={styles.body}>
        <Link href={productHref} className={styles.thumbLink}>
          <Box
            className={styles.thumb}
            style={
              {
                "--thumb-bg":
                  item.thumbnail?.bgColor ?? item.thumbnailBackgroundColor,
              } as CSSProperties
            }
          >
            {item.thumbnail?.src ? (
              <Box
                component="img"
                src={item.thumbnail.src}
                alt={item.thumbnail.alt ?? item.title}
                className={styles.thumbImage}
              />
            ) : (
              (item.thumbnail?.emoji ?? item.emoji)
            )}
          </Box>
        </Link>

        <Box>
          <Typography variant="h3" className={styles.title}>
            <Link href={productHref}>{item.title}</Link>
          </Typography>

          {isSoldOut ? (
            <Chip
              label={soldOutLabel}
              size="small"
              variant="outlined"
              className={styles.soldOut}
            />
          ) : null}

          {item.variant ? (
            <Typography className={styles.meta}>
              {variantLabel}: {item.variant}
            </Typography>
          ) : null}

          <Typography className={styles.meta}>
            {formatCurrency(item.price, locale, item.currency)}
          </Typography>

          <Box className={styles.controls}>
            {!item.isDigital ? (
              <Box className={styles.quantity}>
                <IconButton
                  onClick={() => onDecrease(item.id)}
                  className={styles.quantityButton}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Box className={styles.quantityValue}>{item.quantity}</Box>

                <IconButton
                  onClick={() => onIncrease(item.id)}
                  className={styles.quantityButton}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : null}

            <Box className={styles.priceRow}>
              <Typography component="span" className={styles.price}>
                {formatCurrency(
                  item.price * item.quantity,
                  locale,
                  item.currency,
                )}
              </Typography>

              <IconButton
                aria-label={removeLabel}
                onClick={() => onRemove(item.id)}
                className={styles.removeButton}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
