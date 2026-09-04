"use client";

import { type SyntheticEvent, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

import { sendContactMessageClient } from "@/client-api/contact";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { EMAIL_PATTERN } from "@/utils/validation";

import styles from "./contact-form-section.module.css";
import type { ContactFieldErrors, ContactFormProps } from "./types";

const MIN_MESSAGE_LENGTH = 10;

const ArrowIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ContactForm = ({
  locale,
  contactEmail,
  defaultName,
  defaultEmail,
  labels,
}: ContactFormProps) => {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validate = (): ContactFieldErrors => {
    const next: ContactFieldErrors = {};

    if (!name.trim()) {
      next.name = labels.invalidName;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = labels.invalidEmail;
    }
    if (message.trim().length < MIN_MESSAGE_LENGTH) {
      next.message = labels.invalidMessage;
    }

    return next;
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const response = await sendContactMessageClient({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      locale,
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setFormError(labels.unexpectedError);
      return;
    }

    setIsSent(true);
  };

  const handleReset = () => {
    setName(defaultName);
    setEmail(defaultEmail);
    setMessage("");
    setErrors({});
    setFormError(null);
    setIsSent(false);
  };

  if (isSent) {
    return (
      <Box className={styles.success}>
        <Box className={styles.successBadge}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              d="M4 12l5 5 11-11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        <Typography variant="h2" className={styles.title}>
          {labels.success.titlePrefix} <em>{labels.success.titleAccent}</em>
        </Typography>

        <Typography className={styles.successText}>
          {labels.success.text}{" "}
          <Box
            component="a"
            className={styles.successLink}
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </Box>
          .
        </Typography>

        <Button
          type="button"
          variant="outlined"
          className={styles.successAction}
          onClick={handleReset}
        >
          {labels.success.againLabel}
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <SectionEyebrow label={labels.eyebrow} />

      <Typography variant="h2" className={styles.title}>
        {labels.titlePrefix} <em>{labels.titleAccent}</em>
      </Typography>

      <Typography className={styles.sub}>{labels.sub}</Typography>

      {formError ? (
        <Alert severity="error" className={styles.alert}>
          {formError}
        </Alert>
      ) : null}

      <Box className={styles.row}>
        <Box className={styles.field}>
          <Typography
            component="label"
            htmlFor="contact-name"
            className={styles.label}
          >
            {labels.nameLabel}{" "}
            <Box component="span" className={styles.required}>
              {labels.requiredMark}
            </Box>
          </Typography>
          <TextField
            id="contact-name"
            className={styles.input}
            placeholder={labels.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            autoComplete="name"
            fullWidth
          />
        </Box>

        <Box className={styles.field}>
          <Typography
            component="label"
            htmlFor="contact-email"
            className={styles.label}
          >
            {labels.emailLabel}{" "}
            <Box component="span" className={styles.required}>
              {labels.requiredMark}
            </Box>
          </Typography>
          <TextField
            id="contact-email"
            type="email"
            className={styles.input}
            placeholder={labels.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
            fullWidth
          />
        </Box>
      </Box>

      <Box className={styles.field} sx={{ mt: 2.5 }}>
        <Typography
          component="label"
          htmlFor="contact-message"
          className={styles.label}
        >
          {labels.messageLabel}{" "}
          <Box component="span" className={styles.required}>
            {labels.requiredMark}
          </Box>
        </Typography>
        <TextField
          id="contact-message"
          className={`${styles.input} ${styles.textarea}`}
          placeholder={labels.messagePlaceholder}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          error={Boolean(errors.message)}
          helperText={errors.message}
          multiline
          minRows={7}
          fullWidth
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        className={styles.submit}
        endIcon={<ArrowIcon />}
        loading={isSubmitting}
        fullWidth
      >
        {labels.submitLabel}
      </Button>
    </Box>
  );
};

export type { ContactFormProps } from "./types";
