"use client";

import { type SyntheticEvent, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";
import {
  AuthPageIntro,
  AuthPageShell,
  AuthSectionDivider,
} from "@/components/auth-page-shared";

import { AuthCredentialsForm } from "./credentials-form";
import { AuthGoogleSignIn } from "./google-sign-in";

import type { AuthPageViewProps } from "./types";

export const AuthPageView = ({
  callbackUrl,
  isGoogleEnabled,
  registerHref,
  forgotPasswordHref,
}: AuthPageViewProps) => {
  const t = useTranslations("authPage");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  const handleCredentialsSignIn = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsCredentialsLoading(true);
    setErrorMessage(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsCredentialsLoading(false);

    if (result?.error) {
      setErrorMessage(t("invalidCredentials"));
      return;
    }

    if (result?.url) {
      await mergeGuestWishlistAfterLogin();
      router.push(result.url);
      router.refresh();
      return;
    }

    setErrorMessage(t("unexpectedError"));
  };

  return (
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        chips={t.raw("chips") as string[]}
      />

      <Stack spacing={2.5}>
        <AuthCredentialsForm
          email={email}
          password={password}
          errorMessage={errorMessage}
          isLoading={isCredentialsLoading}
          forgotPasswordHref={forgotPasswordHref}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleCredentialsSignIn}
        />

        <AuthSectionDivider label={t("dividerLabel")} />

        <AuthGoogleSignIn
          isGoogleEnabled={isGoogleEnabled}
          registerHref={registerHref}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </Stack>
    </AuthPageShell>
  );
};

export type { AuthPageViewProps } from "./types";
