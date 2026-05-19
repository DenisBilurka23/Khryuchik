"use client";

import { type SyntheticEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { requestPasswordResetClient } from "@/client-api/auth";
import { AuthPageIntro, AuthPageShell } from "@/components/auth-page-shared";
import { AuthInputErrorCode } from "@/types/auth";

import { ForgotPasswordForm } from "./form";
import type { ForgotPasswordPageViewProps } from "./types";

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
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        chips={t.raw("chips") as string[]}
      />

      <ForgotPasswordForm
        email={email}
        errorMessage={errorMessage}
        successMessage={successMessage}
        isSubmitting={isSubmitting}
        loginHref={loginHref}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
      />
    </AuthPageShell>
  );
};

export type { ForgotPasswordPageViewProps } from "./types";
