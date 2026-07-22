"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useResolvedCart } from "@/hooks/useResolvedCart";
import { formatCurrency, getCountLabel } from "@/utils";

import type { HomeCartSummaryProps } from "./types";
import styles from "../order-section.module.css";

export const HomeCartSummary = ({
  locale,
  country,
  currency,
  shopHref,
  cartHref,
}: HomeCartSummaryProps) => {
  const tStorefront = useTranslations("storefront");
  const tOrder = useTranslations("storefront.orderSection");
  const itemCountLabels = tOrder.raw("cartSummary.itemCount");
  const { items, totalCount, subtotal, hasStoredItems } = useResolvedCart(
    locale,
    country,
  );
  const helperText = tOrder("cartSummary.helperText");
  const itemCountLabel = getCountLabel(totalCount, locale, itemCountLabels);
  const previewItems = items.slice(0, 4);
  const hiddenItemsCount = Math.max(items.length - previewItems.length, 0);
  const shouldStretchRow = previewItems.length === 4 && hiddenItemsCount > 0;
  const formattedSubtotal = formatCurrency(subtotal, locale, currency);
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
          {tOrder("cartTitle")}
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
              {tOrder("totalLabel")}: {formattedSubtotal}
            </Typography>
          </Box>
        ) : null}
      </Box>

      <Stack spacing={2} className={styles.summaryActions}>
        <Button variant="contained" href={shopHref}>
          {tStorefront("nav.shop")}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          href={cartHref}
          className={styles.emailButton}
        >
          {tStorefront("cartLabel")}
        </Button>
      </Stack>
    </Paper>
  );
};