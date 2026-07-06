"use client";

import { type SyntheticEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerUserClient } from "@/client-api/auth";
import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";
import { AuthPageIntro, AuthPageShell } from "@/components/auth-page-shared";
import { AuthInputErrorCode } from "@/types/auth";
import { UserOperationErrorReason } from "@/types/users";

import { RegisterForm } from "./form";
import type { RegisterPageViewProps } from "./types";

export const RegisterPageView = ({
  callbackUrl,
  loginHref,
  locale,
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

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await registerUserClient({ name, email, phone, password, locale });

    if (!response.ok) {
      switch (response.data?.error ?? AuthInputErrorCode.UnexpectedError) {
        case UserOperationErrorReason.EmailTaken:
          setErrorMessage(t("emailTaken"));
          break;
        case AuthInputErrorCode.PasswordTooShort:
          setErrorMessage(t("passwordTooShort"));
          break;
        case AuthInputErrorCode.InvalidEmail:
          setErrorMessage(t("invalidEmail"));
          break;
        case AuthInputErrorCode.MissingFields:
          setErrorMessage(t("missingFields"));
          break;
        default:
          setErrorMessage(t("unexpectedError"));
          break;
      }
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
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        chips={t.raw("chips") as string[]}
      />

      <RegisterForm
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