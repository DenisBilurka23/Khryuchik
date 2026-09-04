"use client";

import { type SyntheticEvent, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";

import { subscribeToNewsletterClient } from "@/client-api/newsletter";
import { NewsletterErrorCode } from "@/types/newsletter";
import { EMAIL_PATTERN } from "@/utils/validation";

import styles from "./newsletter-form.module.css";
import type { NewsletterFormProps } from "./types";

export const NewsletterForm = ({
  locale,
  defaultEmail,
  emailPlaceholder,
  buttonLabel,
  successMessage,
  invalidEmailMessage,
  unexpectedErrorMessage,
}: NewsletterFormProps) => {
  const [email, setEmail] = useState(defaultEmail);
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
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      <Box className={styles.controls}>
        <TextField
          type="email"
          className={styles.field}
          placeholder={emailPlaceholder}
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <Button
          type="submit"
          variant="contained"
          className={styles.button}
          loading={isSubmitting}
        >
          {buttonLabel}
        </Button>
      </Box>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {isSubscribed ? <Alert severity="success">{successMessage}</Alert> : null}
    </Box>
  );
};

export type { NewsletterFormProps } from "./types";
