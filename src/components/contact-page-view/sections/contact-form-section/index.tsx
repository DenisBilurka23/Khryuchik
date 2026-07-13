"use client";

import { type FormEvent, useState } from "react";

import { sendContactMessageClient } from "@/client-api/contact";
import { EMAIL_PATTERN } from "@/utils/validation";

import styles from "../../contact-page-view.module.css";
import type { ContactFieldErrors, ContactFormProps } from "./types";

const MIN_MESSAGE_LENGTH = 10;

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      <div className={styles.formCard}>
        <div className={styles.success}>
          <div className={styles.successBadge}>
            <svg
              width="34"
              height="34"
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
          </div>
          <h2 className={styles.successTitle}>
            {labels.success.titlePrefix} <em>{labels.success.titleAccent}</em>
          </h2>
          <p className={styles.successText}>
            {labels.success.text}{" "}
            <a className={styles.successLink} href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={handleReset}
          >
            {labels.success.againLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <span className={styles.formEyebrow}>{labels.eyebrow}</span>
      <h2 className={styles.formTitle}>
        {labels.titlePrefix} <em>{labels.titleAccent}</em>
      </h2>
      <p className={styles.formSub}>{labels.sub}</p>

      {formError ? <p className={styles.formAlert}>{formError}</p> : null}

      <div className={styles.fieldRow}>
        <div
          className={`${styles.field}${errors.name ? ` ${styles.fieldInvalid}` : ""}`}
        >
          <label className={styles.fieldLabel} htmlFor="contact-name">
            {labels.nameLabel} <span>{labels.requiredMark}</span>
          </label>
          <input
            id="contact-name"
            className={styles.fieldInput}
            type="text"
            placeholder={labels.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
          <span className={styles.fieldError}>{errors.name}</span>
        </div>
        <div
          className={`${styles.field}${errors.email ? ` ${styles.fieldInvalid}` : ""}`}
        >
          <label className={styles.fieldLabel} htmlFor="contact-email">
            {labels.emailLabel} <span>{labels.requiredMark}</span>
          </label>
          <input
            id="contact-email"
            className={styles.fieldInput}
            type="email"
            placeholder={labels.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <span className={styles.fieldError}>{errors.email}</span>
        </div>
      </div>

      <div
        className={`${styles.field}${errors.message ? ` ${styles.fieldInvalid}` : ""}`}
      >
        <label className={styles.fieldLabel} htmlFor="contact-message">
          {labels.messageLabel} <span>{labels.requiredMark}</span>
        </label>
        <textarea
          id="contact-message"
          className={styles.fieldTextarea}
          placeholder={labels.messagePlaceholder}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <span className={styles.fieldError}>{errors.message}</span>
      </div>

      <div className={styles.formFoot}>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg} ${styles.btnBlock}`}
          disabled={isSubmitting}
        >
          {labels.submitLabel}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export type { ContactFormProps } from "./types";
