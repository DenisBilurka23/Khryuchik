import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { HomeCartSummary } from "./home-cart-summary";
import styles from "./order-section.module.css";
import type { OrderSectionProps } from "./types";

export const OrderSection = ({
  locale,
  country,
  dictionary,
  shopHref,
  cartHref,
}: OrderSectionProps) => {
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
              <Typography className={styles.eyebrow}>
                {dictionary.orderSection.eyebrow}
              </Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 32, md: 42 } }}
              >
                {dictionary.orderSection.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 2.5, lineHeight: 1.8 }}
              >
                {dictionary.orderSection.lead}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <HomeCartSummary
              locale={locale}
              country={country}
              cartTitle={dictionary.orderSection.cartTitle}
              emptyTitle={dictionary.orderSection.emptyTitle}
              emptyText={dictionary.orderSection.emptyText}
              totalLabel={dictionary.orderSection.totalLabel}
              shopLabel={dictionary.nav.shop}
              cartLabel={dictionary.cartLabel}
              summaryLabels={dictionary.orderSection.cartSummary}
              shopHref={shopHref}
              cartHref={cartHref}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
