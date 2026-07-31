import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getLocalizedPath } from "@/utils";

import styles from "../../storefront/storefront.module.css";
import type { ProductPricingUnavailableProps } from "../types";

export const ProductPricingUnavailable = async ({
  locale,
  title,
}: ProductPricingUnavailableProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.productPage.pricingUnavailable",
  });

  return (
    <Box className={styles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={styles.pageContent}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="sm">
            <Paper
              elevation={0}
              sx={{
                borderRadius: "32px",
                border: "1px dashed #E8D6BF",
                bgcolor: "#fff",
                p: { xs: 4, md: 6 },
                textAlign: "center",
              }}
            >
              <Typography
                sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800 }}
              >
                {title}
              </Typography>

              <Typography
                sx={{ mt: 2, fontSize: 20, fontWeight: 700 }}
                color="primary.main"
              >
                {t("title")}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1.5, lineHeight: 1.8 }}
              >
                {t("text")}
              </Typography>

              <Link
                href={getLocalizedPath(locale, "/shop")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  component="span"
                  variant="contained"
                  size="large"
                  sx={{ mt: 4 }}
                >
                  {t("action")}
                </Button>
              </Link>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
