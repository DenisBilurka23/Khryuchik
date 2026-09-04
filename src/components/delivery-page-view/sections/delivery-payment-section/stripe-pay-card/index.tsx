import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Button, Typography } from "@mui/material";

import { STRIPE_BRAND_COLOR } from "../../../region-config";

import styles from "./stripe-pay-card.module.css";
import type { StripePayCardProps } from "./types";

export const StripePayCard = ({
  secureLabel,
  totalLabel,
  totalValue,
  cardLabel,
  cardMask,
  cardBrand,
  expLabel,
  exp,
  cvcLabel,
  cvc,
  payLabel,
}: StripePayCardProps) => {
  return (
    <Box className={styles.card}>
      <Box className={styles.head}>
        <Typography
          component="span"
          className={styles.wordmark}
          sx={{ color: STRIPE_BRAND_COLOR }}
        >
          stripe
        </Typography>

        <Box className={styles.secure}>
          <LockOutlinedIcon className={styles.secureIcon} />
          {secureLabel}
        </Box>
      </Box>

      <Box className={styles.total}>
        <Typography component="span" className={styles.totalLabel}>
          {totalLabel}
        </Typography>
        <Typography component="span" className={styles.totalValue}>
          {totalValue}
        </Typography>
      </Box>

      <Box className={styles.field}>
        <Typography component="label" className={styles.fieldLabel}>
          {cardLabel}
        </Typography>
        <Box className={styles.fieldValue}>
          <Box component="span">{cardMask}</Box>
          <Box component="span" className={styles.cardBrand}>
            {cardBrand}
          </Box>
        </Box>
      </Box>

      <Box className={styles.fieldRow}>
        <Box className={styles.field}>
          <Typography component="label" className={styles.fieldLabel}>
            {expLabel}
          </Typography>
          <Box className={styles.fieldValue}>{exp}</Box>
        </Box>
        <Box className={styles.field}>
          <Typography component="label" className={styles.fieldLabel}>
            {cvcLabel}
          </Typography>
          <Box className={styles.fieldValue}>{cvc}</Box>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        className={styles.payButton}
      >
        {payLabel}
      </Button>
    </Box>
  );
};

export type { StripePayCardProps } from "./types";
