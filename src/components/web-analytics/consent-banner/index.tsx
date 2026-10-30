"use client";

import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Plate } from "@/components/primitives";
import { setAnalyticsConsent, useAnalyticsConsent } from "@/stores/analytics";

import type { AnalyticsConsentBannerProps } from "../types";

const bannerSx = {
  width: "100%",
  maxWidth: 440,
  boxShadow: "var(--shadow-floating)",
} as const;

const titleSx = {
  fontSize: 16,
  fontWeight: 700,
  color: "var(--color-accent)",
} as const;

const textSx = {
  mt: 1,
  fontSize: 14,
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
} as const;

const privacyLinkSx = {
  color: "var(--color-action)",
  textDecoration: "underline",
} as const;

export const AnalyticsConsentBanner = ({
  requiresConsent,
  privacyHref,
}: AnalyticsConsentBannerProps) => {
  const t = useTranslations("storefront.analyticsConsent");
  const { ready, status, settingsOpen } = useAnalyticsConsent();
  const open = ready && (settingsOpen || (requiresConsent && status === null));

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Plate pad="sm" role="region" aria-label={t("title")} sx={bannerSx}>
        <Typography component="p" sx={titleSx}>
          {t("title")}
        </Typography>
        <Typography sx={textSx}>
          {t("text")}{" "}
          <Link href={privacyHref}>
            <Box component="span" sx={privacyLinkSx}>
              {t("privacyLink")}
            </Box>
          </Link>
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setAnalyticsConsent("denied")}
          >
            {t("decline")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setAnalyticsConsent("granted")}
          >
            {t("accept")}
          </Button>
        </Stack>
      </Plate>
    </Snackbar>
  );
};
