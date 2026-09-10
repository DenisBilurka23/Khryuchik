"use client";

import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { useTranslations } from "next-intl";

import { AuthInviteCard, AuthPageHeading } from "@/components/auth-page-shared";
import { HeroPanel, IconTile, Plate } from "@/components/primitives";
import { useEmailVerification } from "@/hooks/useEmailVerification";

import { PageShell } from "../storefront/page-shell";

import type { VerifyEmailPageViewProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1.25fr) minmax(0, 1fr)",
  },
  alignItems: "center",
  gap: { xs: 3, md: 2.5 },
  mt: "18px",
  p: { xs: "20px 16px", md: 2.5 },
  border: "1px solid var(--color-accent-soft)",
  boxShadow: "var(--shadow-panel)",
} as const;

const cardSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 2.5,
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-floating)",
  p: { xs: "22px 18px", md: "32px 34px" },
} as const;

const iconTileSx = {
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent-pale)",
  color: "var(--color-action)",
} as const;

const alertSx = {
  width: "100%",
  borderRadius: "var(--radius-field)",
} as const;

const asideSx = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: { xs: 480, md: "none" },
  mx: "auto",
  minWidth: 0,
} as const;

export const VerifyEmailPageView = ({
  token,
  locale,
  loginHref,
}: VerifyEmailPageViewProps) => {
  const t = useTranslations("verifyEmailPage");
  const status = useEmailVerification({ token, locale });

  return (
    <PageShell>
      <Box component="section">
        <Container maxWidth="lg">
          <AuthPageHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
          />

          <HeroPanel tone="pale" sx={panelSx}>
            <Plate pad="none" sx={cardSx}>
              <IconTile tone="accent" sx={iconTileSx}>
                <MarkEmailReadOutlinedIcon />
              </IconTile>

              <Box aria-live="polite" sx={{ width: "100%" }}>
                {status === "pending" ? <CircularProgress size={28} /> : null}

                {status === "success" ? (
                  <Alert severity="success" sx={alertSx}>
                    {t("successMessage")}
                  </Alert>
                ) : null}

                {status === "invalid" ? (
                  <Alert severity="error" sx={alertSx}>
                    {t("invalidToken")}
                  </Alert>
                ) : null}

                {status === "error" ? (
                  <Alert severity="error" sx={alertSx}>
                    {t("unexpectedError")}
                  </Alert>
                ) : null}
              </Box>
            </Plate>

            <Box sx={asideSx}>
              <AuthInviteCard
                title={t("loginPrompt")}
                actionLabel={t("loginLinkLabel")}
                href={loginHref}
              />
            </Box>
          </HeroPanel>
        </Container>
      </Box>
    </PageShell>
  );
};

export type { VerifyEmailPageViewProps } from "./types";
