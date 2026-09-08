"use client";

import { type SyntheticEvent, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";

import { subscribeToNewsletterClient } from "@/client-api/newsletter";
import { NewsletterErrorCode } from "@/types/newsletter";
import { EMAIL_PATTERN } from "@/utils/validation";

import type { NewsletterFormProps } from "./types";

const rowSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: "stretch",
  gap: { xs: 1.5, sm: 0 },
} as const;

const fieldSx = {
  flex: "1 1 auto",
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    height: 52,
    paddingInline: "18px",
    borderRadius: {
      xs: "var(--radius-field)",
      sm: "var(--radius-field) 0 0 var(--radius-field)",
    },
    background: "var(--color-card)",
    fontSize: 15,
  },
  "& .MuiOutlinedInput-input": { padding: 0 },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "var(--color-text-muted)",
    opacity: 1,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-rose)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "var(--color-action)",
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "var(--shadow-focus)",
  },
} as const;

const submitSx = {
  flex: "0 0 auto",
  minHeight: 52,
  paddingInline: "28px",
  border: "none",
  borderRadius: {
    xs: "var(--radius-button)",
    sm: "0 var(--radius-button) var(--radius-button) 0",
  },
  background: "var(--color-accent)",
  color: "var(--color-white)",
  whiteSpace: "nowrap",
  "&:hover": { background: "var(--color-action-hover)" },
  "&:focus-visible": {
    outline: "2px solid var(--color-border-rose)",
    outlineOffset: 3,
  },
} as const;

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      <Box sx={rowSx}>
        <TextField
          type="email"
          sx={fieldSx}
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
          loading={isSubmitting}
          sx={submitSx}
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
