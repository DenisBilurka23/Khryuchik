"use client";

import { type SyntheticEvent, useState } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";

import { subscribeToNewsletterClient } from "@/client-api/newsletter";
import { NewsletterErrorCode } from "@/types/newsletter";
import { EMAIL_PATTERN } from "@/utils/validation";

import type { NewsletterFormProps } from "./types";

export const NewsletterForm = ({
  locale,
  emailPlaceholder,
  buttonLabel,
  successMessage,
  invalidEmailMessage,
  unexpectedErrorMessage,
}: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setErrorMessage(invalidEmailMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await subscribeToNewsletterClient(email, locale);

    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(
        response.data?.error === NewsletterErrorCode.InvalidEmail
          ? invalidEmailMessage
          : unexpectedErrorMessage,
      );
      return;
    }

    setIsSubscribed(true);
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {isSubscribed ? <Alert severity="success">{successMessage}</Alert> : null}

      <TextField
        fullWidth
        type="email"
        placeholder={emailPlaceholder}
        variant="outlined"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />
      <Button type="submit" fullWidth variant="contained" loading={isSubmitting}>
        {buttonLabel}
      </Button>
    </Stack>
  );
};
