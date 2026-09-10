"use client";

import { type SyntheticEvent, useState } from "react";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HeroPanel } from "@/components/primitives";
import { useEmailVerificationResend } from "@/hooks/useEmailVerificationResend";
import { SignInErrorCode } from "@/types/auth";
import { getLocalizedPath } from "@/utils";

import { PageShell } from "../storefront/page-shell";
import { AuthIntro } from "./intro";
import { AuthRegisterInvite } from "./register-invite";
import { AuthSignInCard } from "./sign-in-card";

import type { AuthPageViewProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1fr) minmax(0, 1.4fr)",
  },
  alignItems: "stretch",
  gap: 3,
  mt: "14px",
  p: { xs: "20px 16px", md: 3.5 },
  boxShadow: "var(--shadow-panel)",
} as const;

export const AuthPageView = ({
  callbackUrl,
  isGoogleEnabled,
  locale,
  registerHref,
  forgotPasswordHref,
}: AuthPageViewProps) => {
  const t = useTranslations("authPage");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const verificationResend = useEmailVerificationResend(locale);

  const resendMessages: Record<string, string | null> = {
    idle: null,
    sending: null,
    sent: t("verificationSent"),
    error: t("verificationResendFailed"),
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  const handleCredentialsSignIn = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsCredentialsLoading(true);
    setErrorMessage(null);
    setIsEmailUnverified(false);
    verificationResend.reset();

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsCredentialsLoading(false);

    if (result?.error) {
      const isUnverified = result.error === SignInErrorCode.EmailNotVerified;

      setIsEmailUnverified(isUnverified);
      setErrorMessage(
        isUnverified ? t("emailNotVerified") : t("invalidCredentials"),
      );
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
    <PageShell>
      <Box component="section">
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              {
                label: t("breadcrumbs.home"),
                href: getLocalizedPath(locale, "/"),
              },
              { label: t("breadcrumbs.current") },
            ]}
          />

          <AuthIntro title={t("title")} lead={t("lead")} />

          <HeroPanel tone="rose" sx={panelSx}>
            <AuthSignInCard
              email={email}
              password={password}
              errorMessage={errorMessage}
              isLoading={isCredentialsLoading}
              forgotPasswordHref={forgotPasswordHref}
              canResendVerification={isEmailUnverified}
              isResendingVerification={verificationResend.status === "sending"}
              resendVerificationMessage={
                resendMessages[verificationResend.status]
              }
              isGoogleEnabled={isGoogleEnabled}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onResendVerification={() => {
                void verificationResend.resend(email);
              }}
              onSubmit={handleCredentialsSignIn}
              onGoogleSignIn={handleGoogleSignIn}
            />

            <AuthRegisterInvite registerHref={registerHref} />
          </HeroPanel>
        </Container>
      </Box>
    </PageShell>
  );
};

export type { AuthPageViewProps } from "./types";
