"use client";

import { type SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerUserClient } from "@/client-api/auth";
import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";
import { AuthPageIntro, AuthPageShell } from "@/components/auth-page-shared";

import { RegisterForm } from "./form";
import type { RegisterPageViewProps } from "./types";
import { getRegisterErrorMessage } from "./utils";

export const RegisterPageView = ({
  dictionary,
  callbackUrl,
  loginHref,
}: RegisterPageViewProps) => {
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
      setErrorMessage(dictionary.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await registerUserClient({ name, email, phone, password });

    if (!response.ok) {
      const data = response.data;
      setErrorMessage(
        getRegisterErrorMessage(data?.error ?? "unexpected_error", dictionary),
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