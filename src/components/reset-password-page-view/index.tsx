"use client";

import { type SyntheticEvent, useState } from "react";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { confirmPasswordResetClient } from "@/client-api/auth";
import { AuthInviteCard, AuthPageHeading } from "@/components/auth-page-shared";
import { HeroPanel } from "@/components/primitives";
import { AuthInputErrorCode, PasswordResetErrorReason } from "@/types/auth";

import { PageShell } from "../storefront/page-shell";
import { ResetPasswordForm } from "./form";

import type { ResetPasswordPageViewProps } from "./types";

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

const asideSx = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: { xs: 480, md: "none" },
  mx: "auto",
  minWidth: 0,
} as const;

export const ResetPasswordPageView = ({
  token,
  loginHref,
}: ResetPasswordPageViewProps) => {
  const t = useTranslations("resetPasswordPage");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const response = await confirmPasswordResetClient(token, password);
    const data = response.data;

    setIsSubmitting(false);

    if (!response.ok) {
      switch (data?.error) {
        case AuthInputErrorCode.PasswordTooShort:
          setErrorMessage(t("passwordTooShort"));
          return;
        case PasswordResetErrorReason.InvalidToken:
          setErrorMessage(t("invalidToken"));
          return;
        default:
          setErrorMessage(t("unexpectedError"));
          return;
      }
    }

    setSuccessMessage(t("successMessage"));
    setTimeout(() => {
      router.push(loginHref);
      router.refresh();
    }, 1200);
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
            <ResetPasswordForm
              password={password}
              confirmPassword={confirmPassword}
              errorMessage={errorMessage}
              successMessage={successMessage}
              isSubmitting={isSubmitting}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleSubmit}
            />

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

export type { ResetPasswordPageViewProps } from "./types";
