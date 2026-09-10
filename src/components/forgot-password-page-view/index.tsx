"use client";

import { type SyntheticEvent, useState } from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { requestPasswordResetClient } from "@/client-api/auth";
import { AuthInviteCard, AuthPageHeading } from "@/components/auth-page-shared";
import { HeroPanel } from "@/components/primitives";
import { AuthInputErrorCode } from "@/types/auth";

import { PageShell } from "../storefront/page-shell";
import { ForgotPasswordForm } from "./form";
import { ForgotPasswordIllustration } from "./illustration";

import type { ForgotPasswordPageViewProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(0, 1fr)",
  },
  alignItems: "start",
  gap: { xs: 3, md: 2.5 },
  mt: "18px",
  p: { xs: "20px 16px", md: 2.5 },
  border: "1px solid var(--color-accent-soft)",
  boxShadow: "var(--shadow-panel)",
} as const;

const columnSx = {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 2.5, md: "18px" },
  width: "100%",
  maxWidth: { xs: 480, md: "none" },
  mx: "auto",
  minWidth: 0,
} as const;

const hintSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.25,
  px: { xs: 0, md: 0.5 },
} as const;

const hintIconSx = {
  flexShrink: 0,
  mt: "1px",
  color: "var(--color-accent)",
} as const;

const hintTextSx = {
  fontSize: 13,
  lineHeight: 1.55,
  color: "var(--color-text-secondary)",
} as const;

export const ForgotPasswordPageView = ({
  locale,
  loginHref,
}: ForgotPasswordPageViewProps) => {
  const t = useTranslations("forgotPasswordPage");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const response = await requestPasswordResetClient(email, locale);
    const data = response.data;

    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(
        data?.error === AuthInputErrorCode.InvalidEmail
          ? t("invalidEmail")
          : t("unexpectedError"),
      );
      return;
    }

    setSuccessMessage(t("successMessage"));
  };

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
            <Box sx={columnSx}>
              <ForgotPasswordForm
                email={email}
                errorMessage={errorMessage}
                successMessage={successMessage}
                isSubmitting={isSubmitting}
                onEmailChange={setEmail}
                onSubmit={handleSubmit}
              />

              <AuthInviteCard
                title={t("loginPrompt")}
                actionLabel={t("loginLinkLabel")}
                href={loginHref}
              />
            </Box>

            <Box sx={columnSx}>
              <ForgotPasswordIllustration alt={t("illustrationAlt")} />

              <Box sx={hintSx}>
                <ScheduleOutlinedIcon fontSize="small" sx={hintIconSx} />

                <Typography sx={hintTextSx}>{t("tokenHint")}</Typography>
              </Box>
            </Box>
          </HeroPanel>
        </Container>
      </Box>
    </PageShell>
  );
};

export type { ForgotPasswordPageViewProps } from "./types";
