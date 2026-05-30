import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { STRIPE_BRAND_COLOR } from "../../region-config";
import { ByReceiptCard } from "./by-receipt-card";
import { StripePayCard } from "./stripe-pay-card";
import type { DeliveryPaymentSectionProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
};

export const DeliveryPaymentSection = ({
  eyebrow,
  title,
  short,
  desc,
  badge,
  receipt,
  stripe,
  paymentVariant,
  accent,
}: DeliveryPaymentSectionProps) => {
  const isStripe = paymentVariant === "stripe";
  const highlight = isStripe ? STRIPE_BRAND_COLOR : accent;

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 5 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid rgba(42,37,34,0.08)",
            borderTop: `4px solid ${highlight}`,
            borderRadius: 4,
            p: { xs: 3.5, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
            gap: { xs: 4, md: 7 },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={{ ...eyebrowSx, color: accent }}>
              {eyebrow}
            </Typography>
            <Typography
              variant="h2"
              sx={{ mt: 1.5, fontSize: { xs: 30, md: 44 } }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontFamily: serif,
                fontSize: 22,
                fontStyle: "italic",
                mt: 2,
                mb: 2,
              }}
            >
              {short}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.65, mb: 2.75, maxWidth: "50ch" }}
            >
              {desc}
            </Typography>
            <Chip
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: highlight,
                  }}
                />
              }
              label={badge}
              sx={{
                backgroundColor: "#fff8f0",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: 13,
                border: "1px solid rgba(42,37,34,0.14)",
                "& .MuiChip-icon": { ml: 1.25 },
              }}
            />
          </Box>

          <Stack>
            {isStripe
              ? stripe && <StripePayCard {...stripe} />
              : receipt && <ByReceiptCard {...receipt} accent={accent} />}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export type { DeliveryPaymentSectionProps } from "./types";
