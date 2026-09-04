import { Box, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";

import { ByReceiptCard } from "./by-receipt-card";
import styles from "./delivery-payment-section.module.css";
import { StripePayCard } from "./stripe-pay-card";
import type { DeliveryPaymentSectionProps } from "./types";

export const DeliveryPaymentSection = ({
  eyebrow,
  title,
  short,
  desc,
  badge,
  receipt,
  stripe,
  paymentVariant,
}: DeliveryPaymentSectionProps) => {
  const isStripe = paymentVariant === "stripe";

  return (
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" className={styles.title}>
              {title}
            </Typography>

            <Typography component="p" className={styles.short}>
              {short}
            </Typography>

            <Typography component="p" className={styles.desc}>
              {desc}
            </Typography>

            <Box className={styles.badge}>
              <Box component="span" className={styles.badgeDot} aria-hidden />
              {badge}
            </Box>
          </Box>

          <Box className={styles.card}>
            {isStripe
              ? stripe && <StripePayCard {...stripe} />
              : receipt && <ByReceiptCard {...receipt} />}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryPaymentSectionProps } from "./types";
