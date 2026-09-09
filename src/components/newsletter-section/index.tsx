import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import newsletterImage from "@/assets/Newsletter.png";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { getServerAuthSession } from "@/server/auth/config";
import { isSubscribedToNewsletter } from "@/server/newsletter/services/newsletter.service";

import { NewsletterForm } from "./form";
import type { NewsletterSectionProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(0, 1fr)",
    lg: "minmax(0, 1fr) minmax(0, 0.95fr) auto",
  },
  alignItems: "center",
  gap: { xs: 3, lg: 4 },
  p: { xs: "28px 20px", md: "18px 40px" },
  borderRadius: "var(--radius-panel)",
  background: "var(--color-newsletter)",
  color: "var(--color-text)",
} as const;

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
    <Box component="section" sx={{ pt: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Box sx={panelSx}>
          <Box>
            <SectionEyebrow label={t("eyebrow")} />

            <Typography
              variant="h2"
              sx={{ mt: 1.25, fontSize: { xs: 26, md: 30 }, lineHeight: 1.15 }}
            >
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

          <Box
            sx={{ display: { xs: "none", lg: "block" }, justifySelf: "end" }}
          >
            <Image
              src={newsletterImage}
              alt=""
              aria-hidden
              sizes="200px"
              style={{ width: "clamp(130px, 14vw, 200px)", height: "auto" }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export type { NewsletterSectionProps } from "./types";
