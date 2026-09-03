import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { getServerAuthSession } from "@/server/auth/config";
import { isSubscribedToNewsletter } from "@/server/newsletter/services/newsletter.service";
import { NewsletterForm } from "./form";
import styles from "./newsletter-section.module.css";
import type { NewsletterSectionProps } from "./types";

export const NewsletterSection = async ({ locale }: NewsletterSectionProps) => {
  const session = await getServerAuthSession();
  const accountEmail = session?.user?.email ?? "";

  if (accountEmail && (await isSubscribedToNewsletter(accountEmail))) {
    return null;
  }

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
          sx={{ px: { xs: 3, md: 5 }, py: { xs: 4, md: 5 } }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <SectionEyebrow label={t("eyebrow")} />
              <Typography variant="h2" sx={{ mt: 1 }}>
                {t("title")}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 2, lineHeight: 1.7 }}
              >
                {t("text")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} className={styles.formCard} sx={{ p: 2 }}>
                <NewsletterForm
                  locale={locale}
                  defaultEmail={accountEmail}
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
