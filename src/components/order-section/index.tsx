import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import orderImage from "@/assets/MainBottomTransparent.png";
import { SectionEyebrow } from "@/components/section-eyebrow";
import type { StorefrontDictionary } from "@/i18n/types";

import { OrderSteps } from "./order-steps";
import type { OrderSectionProps } from "./types";

const actionSx = {
  whiteSpace: "nowrap",
  width: { xs: "100%", sm: "auto" },
} as const;

export const OrderSection = async ({
  locale,
  shopHref,
  cartHref,
}: OrderSectionProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.orderSection",
  });
  const steps = t.raw("steps") as StorefrontDictionary["orderSection"]["steps"];

  return (
    <Box component="section" id="order" sx={{ py: { xs: 1.5, md: 2 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: "24px 20px", md: 4 },
            borderRadius: "var(--radius-panel)",
            background: "var(--color-cream)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                lg: "minmax(0, 3fr) minmax(0, 1fr)",
              },
              alignItems: "center",
              gap: 4,
            }}
          >
            <Box>
              <SectionEyebrow label={t("eyebrow")} />

              <Typography variant="h2" sx={{ mt: 1, mb: 4 }}>
                {t("title")}
              </Typography>

              <OrderSteps steps={steps} />
            </Box>

            <Image
              src={orderImage}
              alt=""
              sizes="(max-width: 1200px) 40vw, 260px"
              style={{
                display: "block",
                width: "100%",
                maxWidth: 260,
                height: "auto",
                marginInline: "auto",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              mt: 5,
            }}
          >
            <Link href={shopHref}>
              <Button component="span" variant="contained" sx={actionSx}>
                {t("shopAction")}
              </Button>
            </Link>

            <Link href={cartHref}>
              <Button
                component="span"
                variant="outlined"
                sx={{ ...actionSx, background: "var(--color-card)" }}
              >
                {t("cartAction")}
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
