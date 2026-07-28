"use client";

import { Alert, CircularProgress, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AuthLinkPrompt,
  AuthPageIntro,
  AuthPageShell,
  AuthSectionCard,
} from "@/components/auth-page-shared";
import { useEmailVerification } from "@/hooks/useEmailVerification";

import type { VerifyEmailPageViewProps } from "./types";

export const VerifyEmailPageView = ({
  token,
  locale,
  loginHref,
}: VerifyEmailPageViewProps) => {
  const t = useTranslations("verifyEmailPage");
  const status = useEmailVerification({ token, locale });

  return (
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />

      <AuthSectionCard>
        <Stack spacing={2.5} alignItems="flex-start">
          {status === "pending" ? <CircularProgress size={28} /> : null}

          {status === "success" ? (
            <Alert severity="success" sx={{ width: "100%" }}>
              {t("successMessage")}
            </Alert>
          ) : null}

          {status === "invalid" ? (
            <Alert severity="error" sx={{ width: "100%" }}>
              {t("invalidToken")}
            </Alert>
          ) : null}

          {status === "error" ? (
            <Alert severity="error" sx={{ width: "100%" }}>
              {t("unexpectedError")}
            </Alert>
          ) : null}

          {status === "pending" ? null : (
            <AuthLinkPrompt href={loginHref} label={t("loginLinkLabel")} />
          )}
        </Stack>
      </AuthSectionCard>
    </AuthPageShell>
  );
};

export type { VerifyEmailPageViewProps } from "./types";
