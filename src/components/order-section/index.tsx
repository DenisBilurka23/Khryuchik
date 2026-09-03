import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { SectionEyebrow } from "@/components/section-eyebrow";
import {
  BRAND_ORDER_IMAGE_HEIGHT,
  BRAND_ORDER_IMAGE_SRC,
  BRAND_ORDER_IMAGE_WIDTH,
} from "@/constants/brand";
import type { StorefrontDictionary } from "@/i18n/types";

import { OrderSteps } from "./order-steps";
import styles from "./order-section.module.css";
import type { OrderSectionProps } from "./types";

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
    <Box component="section" id="order" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, lg: 9 }}>
              <SectionEyebrow label={t("eyebrow")} />

              <Typography variant="h2" sx={{ mt: 1, mb: 4 }}>
                {t("title")}
              </Typography>

              <OrderSteps steps={steps} />
            </Grid>

            <Grid size={{ xs: 12, lg: 3 }}>
              <Image
                src={BRAND_ORDER_IMAGE_SRC}
                alt=""
                width={BRAND_ORDER_IMAGE_WIDTH}
                height={BRAND_ORDER_IMAGE_HEIGHT}
                sizes="(max-width: 1200px) 40vw, 260px"
                className={styles.illustration}
              />
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 5 }}
          >
            <Link
              href={shopHref}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button
                component="span"
                variant="contained"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {t("shopAction")}
              </Button>
            </Link>
            <Link
              href={cartHref}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button
                component="span"
                variant="outlined"
                className={styles.cartButton}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {t("cartAction")}
              </Button>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
