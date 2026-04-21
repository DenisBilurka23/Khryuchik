"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import { useResolvedCart } from "@/hooks/useResolvedCart";
import { formatCurrency, getCountLabel, getCountryCurrency } from "@/utils";

import type {
  HomeCartSummaryProps,
  HomeCartSummaryViewModelParams,
} from "./types";
import styles from "./order-section.module.css";

const createHomeCartSummaryViewModel = ({
  locale,
  country,
  items,
  totalCount,
  subtotal,
  labels,
}: HomeCartSummaryViewModelParams) => {
  const previewItems = items.slice(0, 4);
  const hiddenItemsCount = Math.max(items.length - previewItems.length, 0);

  return {
    hasItems: totalCount > 0,
    helperText: labels.helperText,
    itemCountLabel: getCountLabel(totalCount, locale, labels.itemCount),
    previewItems,
    hiddenItemsCount,
    shouldStretchRow: previewItems.length === 4 && hiddenItemsCount > 0,
    formattedSubtotal: formatCurrency(
      subtotal,
      locale,
      getCountryCurrency(country),
    ),
  };
};

export const HomeCartSummary = ({
  locale,
  country,
  cartTitle,
  emptyTitle,
  emptyText,
  totalLabel,
  shopLabel,
  cartLabel,
  summaryLabels,
  shopHref,
  cartHref,
}: HomeCartSummaryProps) => {
  const { items, totalCount, subtotal, hasStoredItems } = useResolvedCart(
    locale,
    country,
  );
  const {
    helperText,
    itemCountLabel,
    previewItems,
    hiddenItemsCount,
    shouldStretchRow,
    formattedSubtotal,
  } = createHomeCartSummaryViewModel({
    locale,
    country,
    items,
    totalCount,
    subtotal,
    labels: summaryLabels,
  });
  const shouldShowItems = hasStoredItems && items.length > 0;

  return (
    <Paper
      elevation={0}
      className={styles.summaryCard}
      sx={{ p: { xs: 3, md: 4 } }}
    >
      <Box className={styles.summaryBody}>
        <Typography
          variant="h2"
          sx={{ mt: 0, mb: 2.5, fontSize: { xs: 32, md: 42 } }}
        >
          {cartTitle}
        </Typography>
        <Typography className={styles.summaryHelperText}>
          {helperText}
        </Typography>

        {shouldShowItems ? (
          <Box sx={{ mt: 3 }}>
            <Typography className={styles.summaryMetaTitle}>
              {itemCountLabel}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className={`${styles.thumbnailRow} ${shouldStretchRow ? styles.thumbnailRowFull : ""}`.trim()}
              sx={{ mt: 2.5, mb: 2.5 }}
            >
              {previewItems.map((item) => (
                <Box
                  key={item.id}
                  className={`${styles.thumbnail} ${shouldStretchRow ? styles.thumbnailFull : ""}`.trim()}
                  sx={{ bgcolor: item.thumbnailBackgroundColor || "#FFF8F0" }}
                  title={item.title}
                  aria-label={item.title}
                >
                  {item.emoji}
                </Box>
              ))}

              {hiddenItemsCount > 0 ? (
                <Box
                  className={`${styles.thumbnailMore} ${shouldStretchRow ? styles.thumbnailFull : ""}`.trim()}
                >
                  +{hiddenItemsCount}
                </Box>
              ) : null}
            </Stack>

            <Typography className={styles.summaryTotal}>
              {totalLabel}: {formattedSubtotal}
            </Typography>
          </Box>
        ) : (
          <Paper
            elevation={0}
            className={styles.cartCard}
            sx={{ mt: 3, p: 2.5 }}
          >
            <Typography className={styles.summaryMetaTitle}>{emptyTitle}</Typography>
            <Typography className={styles.emptyText}>{emptyText}</Typography>
          </Paper>
        )}
      </Box>

      <Stack spacing={2} className={styles.summaryActions}>
        <Button variant="contained" href={shopHref}>
          {shopLabel}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          href={cartHref}
          className={styles.emailButton}
        >
          {cartLabel}
        </Button>
      </Stack>
    </Paper>
  );
};