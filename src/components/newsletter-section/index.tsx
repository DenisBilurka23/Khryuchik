import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { NewsletterForm } from "./form";
import styles from "./newsletter-section.module.css";
import type { NewsletterSectionProps } from "./types";

export const NewsletterSection = async ({ locale }: NewsletterSectionProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.newsletter",
  });

  return (
    <Box className={styles.section}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          className={styles.panel}
          sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography className={styles.eyebrow}>{t("eyebrow")}</Typography>
              <Typography
                variant="h2"
                sx={{ mt: 2, fontSize: { xs: 30, md: 42 } }}
              >
                {t("title")}
              </Typography>
              <Typography
                sx={{ mt: 2, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}
              >
                {t("text")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} className={styles.formCard} sx={{ p: 2 }}>
                <NewsletterForm
                  locale={locale}
                  emailPlaceholder={t("emailPlaceholder")}
                  buttonLabel={t("buttonLabel")}
                  successMessage={t("successMessage")}
                  invalidEmailMessage={t("invalidEmail")}
                  unexpectedErrorMessage={t("unexpectedError")}
                />
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
