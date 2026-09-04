import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { formatCurrency } from "@/utils";
import type { CartPageLabels } from "@/i18n/types";

import type { OrderSummaryCardProps } from "../types";

import styles from "./order-summary-card.module.css";

export const OrderSummaryCard = ({
  locale,
  currency,
  subtotal,
  discount,
  isDigitalOnly,
  continueShoppingHref,
  checkoutHref,
  isShopClosed = false,
  hasUnavailableItems = false,
}: OrderSummaryCardProps) => {
  const t = useTranslations("storefront.cartPage");
  const labels = t.raw("summary") as CartPageLabels["summary"];
  const total = subtotal - discount;
  const isCheckoutBlocked = isShopClosed || hasUnavailableItems;

  return (
    <Card className={styles.card}>
      <CardContent className={styles.body}>
        <Typography variant="h3" className={styles.title}>
          {labels.title}
        </Typography>

        <Box className={styles.promo}>
          <TextField fullWidth placeholder={labels.promoPlaceholder} />
          <Button variant="outlined" className={styles.promoButton}>
            {labels.promoButton}
          </Button>
        </Box>

        <Box className={styles.rows}>
          <Box className={styles.row}>
            <Typography component="span" className={styles.rowLabel}>
              {labels.itemsLabel}
            </Typography>
            <Typography component="span" className={styles.rowValue}>
              {formatCurrency(subtotal, locale, currency)}
            </Typography>
          </Box>

          {isDigitalOnly ? null : (
            <Box className={styles.row}>
              <Typography component="span" className={styles.rowLabel}>
                {labels.shippingLabel}
              </Typography>
              <Typography
                component="span"
                className={`${styles.rowValue} ${styles.rowValueMuted}`}
              >
                {labels.shippingAtCheckout}
              </Typography>
            </Box>
          )}

          {discount > 0 ? (
            <Box className={styles.row}>
              <Typography component="span" className={styles.rowLabel}>
                {labels.discountLabel}
              </Typography>
              <Typography component="span" className={styles.rowValue}>
                {`-${formatCurrency(discount, locale, currency)}`}
              </Typography>
            </Box>
          ) : null}
        </Box>

        <Divider className={styles.divider} />

        <Box className={styles.total}>
          <Typography component="span" className={styles.totalLabel}>
            {labels.totalLabel}
          </Typography>
          <Typography component="span" className={styles.totalValue}>
            {formatCurrency(total, locale, currency)}
          </Typography>
        </Box>

        {isCheckoutBlocked ? (
          <Button
            disabled
            fullWidth
            variant="contained"
            size="large"
            className={styles.checkoutButton}
          >
            {labels.checkoutButton}
          </Button>
        ) : (
          <Link href={checkoutHref}>
            <Button
              component="span"
              fullWidth
              variant="contained"
              size="large"
              className={styles.checkoutButton}
            >
              {labels.checkoutButton}
            </Button>
          </Link>
        )}

        <Link href={continueShoppingHref}>
          <Button
            component="span"
            fullWidth
            variant="outlined"
            size="large"
            className={styles.continueButton}
          >
            {labels.continueShopping}
          </Button>
        </Link>

        {isCheckoutBlocked ? (
          <Box className={styles.note}>
            {isShopClosed ? (
              <ScheduleOutlinedIcon className={styles.noteIcon} />
            ) : (
              <ReportProblemOutlinedIcon className={styles.noteIcon} />
            )}
            <Typography className={styles.noteText}>
              {isShopClosed ? labels.closedNote : labels.unavailableNote}
            </Typography>
          </Box>
        ) : null}

        <Box
          className={
            isCheckoutBlocked
              ? `${styles.note} ${styles.noteTight}`
              : styles.note
          }
        >
          <LocalOfferOutlinedIcon className={styles.noteIcon} />
          <Typography className={styles.noteText}>{labels.infoText}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
