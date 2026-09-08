"use client";

import { type SyntheticEvent, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

import { sendContactMessageClient } from "@/client-api/contact";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { accentSx } from "@/theme/sx";
import { EMAIL_PATTERN } from "@/utils/validation";

import type { ContactFieldErrors, ContactFormProps } from "./types";

const titleSx = {
  mt: 1.75,
  fontSize: { xs: 30, md: 36 },
  lineHeight: 1.05,
  "& em": accentSx,
} as const;

const labelSx = {
  mb: 1,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--color-text)",
} as const;

const fieldSx = { display: "flex", flexDirection: "column" } as const;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 56,
    paddingInline: "16px",
    borderRadius: "var(--radius-field)",
    background: "var(--color-card)",
    fontSize: 15,
  },
  "& .MuiOutlinedInput-input": { padding: 0 },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "var(--color-text-muted)",
    opacity: 1,
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-border)" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-rose)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "var(--color-action)",
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "var(--shadow-focus)",
  },
  "& .MuiFormHelperText-root": { margin: "6px 0 0", fontSize: 12 },
} as const;

const textareaSx = {
  ...inputSx,
  "& .MuiOutlinedInput-root": {
    ...inputSx["& .MuiOutlinedInput-root"],
    alignItems: "flex-start",
    minHeight: 190,
    padding: "16px",
    lineHeight: 1.5,
  },
} as const;

const requiredSx = { color: "var(--color-action)" } as const;

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
      <Box sx={{ py: 1, textAlign: "center" }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 72,
            height: 72,
            margin: "0 auto 20px",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-accent-pale)",
            color: "var(--color-action)",
          }}
        >
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

        <Typography variant="h2" sx={titleSx}>
          {labels.success.titlePrefix} <em>{labels.success.titleAccent}</em>
        </Typography>

        <Typography
          sx={{
            maxWidth: "44ch",
            margin: "12px auto 0",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--color-text-secondary)",
          }}
        >
          {labels.success.text}{" "}
          <Box
            component="a"
            sx={{ fontWeight: 500, color: "var(--color-action)" }}
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </Box>
          .
        </Typography>

        <Button
          type="button"
          variant="outlined"
          sx={{ mt: 3 }}
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

      <Typography variant="h2" sx={titleSx}>
        {labels.titlePrefix} <em>{labels.titleAccent}</em>
      </Typography>

      <Typography
        sx={{
          mt: 1.5,
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--color-text-secondary)",
        }}
      >
        {labels.sub}
      </Typography>

      {formError ? (
        <Alert
          severity="error"
          sx={{ mt: 2.5, borderRadius: "var(--radius-field)" }}
        >
          {formError}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 1fr) minmax(0, 1fr)",
          },
          gap: 2,
          mt: 3.5,
        }}
      >
        <Box sx={fieldSx}>
          <Typography component="label" htmlFor="contact-name" sx={labelSx}>
            {labels.nameLabel}{" "}
            <Box component="span" sx={requiredSx}>
              {labels.requiredMark}
            </Box>
          </Typography>
          <TextField
            id="contact-name"
            sx={inputSx}
            placeholder={labels.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            autoComplete="name"
            fullWidth
          />
        </Box>

        <Box sx={fieldSx}>
          <Typography component="label" htmlFor="contact-email" sx={labelSx}>
            {labels.emailLabel}{" "}
            <Box component="span" sx={requiredSx}>
              {labels.requiredMark}
            </Box>
          </Typography>
          <TextField
            id="contact-email"
            type="email"
            sx={inputSx}
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

      <Box sx={{ ...fieldSx, mt: 2.5 }}>
        <Typography component="label" htmlFor="contact-message" sx={labelSx}>
          {labels.messageLabel}{" "}
          <Box component="span" sx={requiredSx}>
            {labels.requiredMark}
          </Box>
        </Typography>
        <TextField
          id="contact-message"
          sx={textareaSx}
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
        sx={{ mt: 3, gap: 0.75 }}
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
