"use client";

import { type SyntheticEvent, useState } from "react";
import { Stack } from "@mui/material";
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
  dictionary,
  callbackUrl,
  isGoogleEnabled,
  registerHref,
  forgotPasswordHref,
}: AuthPageViewProps) => {
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
      setErrorMessage(dictionary.invalidCredentials);
      return;
    }

    if (result?.url) {
      await mergeGuestWishlistAfterLogin();
      router.push(result.url);
      router.refresh();
      return;
    }

    setErrorMessage(dictionary.unexpectedError);
  };

  return (
    <AuthPageShell>
      <AuthPageIntro
        eyebrow={dictionary.eyebrow}
        title={dictionary.title}
        lead={dictionary.lead}
        chips={dictionary.chips}
      />

      <Stack spacing={2.5}>
        <AuthCredentialsForm
          dictionary={dictionary}
          email={email}
          password={password}
          errorMessage={errorMessage}
          isLoading={isCredentialsLoading}
          forgotPasswordHref={forgotPasswordHref}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleCredentialsSignIn}
        />

        <AuthSectionDivider label={dictionary.dividerLabel} />

        <AuthGoogleSignIn
          dictionary={dictionary}
          isGoogleEnabled={isGoogleEnabled}
          registerHref={registerHref}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </Stack>
    </AuthPageShell>
  );
};

export type { AuthPageViewProps } from "./types";
