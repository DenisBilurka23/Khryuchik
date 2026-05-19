import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";

import { HomeCartSummary } from "./home-cart-summary";
import styles from "./order-section.module.css";
import type { OrderSectionProps } from "./types";

export const OrderSection = async ({
  locale,
  country,
  shopHref,
  cartHref,
}: OrderSectionProps) => {
  const tOrder = await getTranslations({ locale, namespace: "storefront.orderSection" });

  return (
    <Box component="section" id="order" className={styles.section}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              className={styles.contentCard}
              sx={{ p: { xs: 3, md: 4 } }}
            >
              <Typography className={styles.eyebrow}>{tOrder("eyebrow")}</Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 32, md: 42 } }}
              >
                {tOrder("title")}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 2.5, lineHeight: 1.8 }}
              >
                {tOrder("lead")}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <HomeCartSummary
              locale={locale}
              country={country}
              shopHref={shopHref}
              cartHref={cartHref}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
