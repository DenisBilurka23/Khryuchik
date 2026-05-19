"use client";

import { type SyntheticEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { confirmPasswordResetClient } from "@/client-api/auth";
import { AuthPageIntro, AuthPageShell } from "@/components/auth-page-shared";
import { AuthInputErrorCode, PasswordResetErrorReason } from "@/types/auth";

import { ResetPasswordForm } from "./form";
import type { ResetPasswordPageViewProps } from "./types";

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
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />

      <ResetPasswordForm
        password={password}
        confirmPassword={confirmPassword}
        errorMessage={errorMessage}
        successMessage={successMessage}
        isSubmitting={isSubmitting}
        loginHref={loginHref}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleSubmit}
      />
    </AuthPageShell>
  );
};

export type { ResetPasswordPageViewProps } from "./types";
