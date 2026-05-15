"use client";

import { type SyntheticEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerUserClient } from "@/client-api/auth";
import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";
import { AuthPageIntro, AuthPageShell } from "@/components/auth-page-shared";
import { AuthInputErrorCode } from "@/types/auth";
import { getRegisterErrorMessage } from "@/utils/register-page";

import { RegisterForm } from "./form";
import type { RegisterPageViewProps } from "./types";

export const RegisterPageView = ({
  callbackUrl,
  loginHref,
}: RegisterPageViewProps) => {
  const t = useTranslations("registerPage");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dictionary = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    lead: t("lead"),
    chips: t.raw("chips") as string[],
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    phoneLabel: t("phoneLabel"),
    phonePlaceholder: t("phonePlaceholder"),
    passwordLabel: t("passwordLabel"),
    passwordPlaceholder: t("passwordPlaceholder"),
    confirmPasswordLabel: t("confirmPasswordLabel"),
    confirmPasswordPlaceholder: t("confirmPasswordPlaceholder"),
    submitButton: t("submitButton"),
    loginPrompt: t("loginPrompt"),
    loginLinkLabel: t("loginLinkLabel"),
    passwordMismatch: t("passwordMismatch"),
    emailTaken: t("emailTaken"),
    passwordTooShort: t("passwordTooShort"),
    invalidEmail: t("invalidEmail"),
    missingFields: t("missingFields"),
    unexpectedError: t("unexpectedError"),
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(dictionary.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await registerUserClient({ name, email, phone, password });

    if (!response.ok) {
      const data = response.data;
      setErrorMessage(
        getRegisterErrorMessage(data?.error ?? AuthInputErrorCode.UnexpectedError, dictionary),
      );
      setIsSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (signInResult?.url) {
      await mergeGuestWishlistAfterLogin();
      router.push(signInResult.url);
      router.refresh();
      return;
    }

    router.push(loginHref);
    router.refresh();
  };

  return (
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={dictionary.eyebrow}
        title={dictionary.title}
        lead={dictionary.lead}
        chips={dictionary.chips}
      />

      <RegisterForm
        dictionary={dictionary}
        name={name}
        email={email}
        phone={phone}
        password={password}
        confirmPassword={confirmPassword}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        loginHref={loginHref}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleSubmit}
      />
    </AuthPageShell>
  );
};

export type { RegisterPageViewProps } from "./types";