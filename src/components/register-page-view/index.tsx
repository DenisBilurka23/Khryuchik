"use client";

import { type SyntheticEvent, useState } from "react";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { Box, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerUserClient } from "@/client-api/auth";
import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";
import { AuthLinkPrompt } from "@/components/auth-page-shared";
import { HeroPanel, IconTile, Plate } from "@/components/primitives";
import { AuthInputErrorCode } from "@/types/auth";
import { UserOperationErrorReason } from "@/types/users";

import { PageShell } from "../storefront/page-shell";
import { RegisterForm } from "./form";
import { RegisterIllustration } from "./illustration";
import { RegisterIntro } from "./intro";
import { RegisterLoginInvite } from "./login-invite";

import type { RegisterPageViewProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(0, 1.25fr) minmax(0, 1fr)",
  },
  alignItems: "stretch",
  gap: { xs: 3, md: 2.5 },
  mt: "18px",
  p: { xs: "20px 16px", md: 2.5 },
  border: "1px solid var(--color-accent-soft)",
  boxShadow: "var(--shadow-panel)",
} as const;

const asideSx = {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 2.5, md: "18px" },
  width: "100%",
  maxWidth: { xs: 480, md: "none" },
  mx: "auto",
  minWidth: 0,
} as const;

const noticeSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.75,
  mt: "18px",
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-floating)",
} as const;

export const RegisterPageView = ({
  callbackUrl,
  loginHref,
  locale,
}: RegisterPageViewProps) => {
  const t = useTranslations("registerPage");
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await registerUserClient({
      firstName,
      lastName,
      email,
      phone,
      password,
      locale,
    });

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

    if (response.data?.requiresVerification) {
      setIsSubmitting(false);
      setIsVerificationPending(true);
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

  if (isVerificationPending) {
    return (
      <PageShell>
        <Box component="section">
          <Container maxWidth="lg">
            <RegisterIntro
              eyebrow={t("eyebrow")}
              title={t("verificationSentTitle")}
              lead={t("verificationSentText", { email })}
            />

            <Plate sx={noticeSx}>
              <IconTile tone="accent">
                <MarkEmailReadOutlinedIcon />
              </IconTile>

              <AuthLinkPrompt href={loginHref} label={t("loginLinkLabel")} />
            </Plate>
          </Container>
        </Box>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Box component="section">
        <Container maxWidth="lg">
          <RegisterIntro
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
          />

          <HeroPanel tone="pale" sx={panelSx}>
            <RegisterForm
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              password={password}
              confirmPassword={confirmPassword}
              errorMessage={errorMessage}
              isSubmitting={isSubmitting}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleSubmit}
            />

            <Box sx={asideSx}>
              <RegisterIllustration alt={t("illustrationAlt")} />

              <RegisterLoginInvite loginHref={loginHref} />
            </Box>
          </HeroPanel>
        </Container>
      </Box>
    </PageShell>
  );
};

export type { RegisterPageViewProps } from "./types";
