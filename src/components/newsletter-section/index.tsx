import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { SectionEyebrow } from "@/components/section-eyebrow";
import {
  BRAND_NEWSLETTER_IMAGE_HEIGHT,
  BRAND_NEWSLETTER_IMAGE_SRC,
  BRAND_NEWSLETTER_IMAGE_WIDTH,
} from "@/constants/brand";
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
    <Box component="section" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <Box>
            <SectionEyebrow label={t("eyebrow")} />

            <Typography variant="h2" className={styles.title}>
              {t("title")}
            </Typography>
          </Box>

          <NewsletterForm
            locale={locale}
            defaultEmail={accountEmail}
            emailPlaceholder={t("emailPlaceholder")}
            buttonLabel={t("buttonLabel")}
            successMessage={t("successMessage")}
            invalidEmailMessage={t("invalidEmail")}
            unexpectedErrorMessage={t("unexpectedError")}
          />

          <Image
            src={BRAND_NEWSLETTER_IMAGE_SRC}
            alt=""
            aria-hidden
            width={BRAND_NEWSLETTER_IMAGE_WIDTH}
            height={BRAND_NEWSLETTER_IMAGE_HEIGHT}
            sizes="200px"
            className={styles.illustration}
          />
        </Box>
      </Container>
    </Box>
  );
};

export type { NewsletterSectionProps } from "./types";
