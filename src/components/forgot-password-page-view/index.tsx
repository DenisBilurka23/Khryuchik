"use client";

import { type SyntheticEvent, useState } from "react";

import { requestPasswordResetClient } from "@/client-api/auth";
import { AuthPageIntro, AuthPageShell } from "@/components/auth-page-shared";

import { ForgotPasswordForm } from "./form";
import type { ForgotPasswordPageViewProps } from "./types";

export const ForgotPasswordPageView = ({
  dictionary,
  locale,
  loginHref,
}: ForgotPasswordPageViewProps) => {
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
        data?.error === "invalid_email"
          ? dictionary.invalidEmail
          : dictionary.unexpectedError,
      );
      return;
    }

    setSuccessMessage(dictionary.successMessage);
  };

  return (
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={dictionary.eyebrow}
        title={dictionary.title}
        lead={dictionary.lead}
        chips={dictionary.chips}
      />

      <ForgotPasswordForm
        dictionary={dictionary}
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
