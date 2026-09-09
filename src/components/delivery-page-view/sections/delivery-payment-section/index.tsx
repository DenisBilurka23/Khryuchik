import { Box, Container, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { displayFont, leadSx } from "@/theme/sx";

import { ByReceiptCard } from "./by-receipt-card";
import { StripePayCard } from "./stripe-pay-card";
import type { DeliveryPaymentSectionProps } from "./types";

const chipSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  minHeight: 36,
  mt: 3,
  padding: "0 14px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-cream)",
  fontSize: 13,
  color: "var(--color-text-secondary)",
} as const;

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    lg: "minmax(0, 1fr) 360px",
  },
  alignItems: "center",
  gap: { xs: 4, lg: 6 },
  p: { xs: "24px 20px", md: 4, lg: 5 },
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-card)",
} as const;

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
    <Box component="section" sx={{ pt: 4 }}>
      <Container maxWidth="lg">
        <Box sx={panelSx}>
          <Box>
            <SectionEyebrow label={eyebrow} />

            <Typography variant="h2" sx={{ mt: 1.5 }}>
              {title}
            </Typography>

            <Typography
              component="p"
              sx={{
                mt: 2,
                fontFamily: displayFont,
                fontSize: { xs: 20, md: 22 },
                fontStyle: "italic",
                lineHeight: 1.3,
                color: "var(--color-text)",
              }}
            >
              {short}
            </Typography>

            <Typography
              component="p"
              sx={{
                maxWidth: "52ch",
                mt: 1.75,
                ...leadSx,
              }}
            >
              {desc}
            </Typography>

            <Box sx={chipSx}>
              <Box
                component="span"
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-action)",
                }}
              />
              {badge}
            </Box>
          </Box>

          <Box
            sx={{
              justifySelf: { xs: "stretch", lg: "end" },
              width: "100%",
              maxWidth: { xs: "none", lg: 360 },
            }}
          >
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
