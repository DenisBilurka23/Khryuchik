"use client";

import { useState } from "react";
import { Alert, Button, Stack } from "@mui/material";

import { unsubscribeFromNewsletterClient } from "@/client-api/newsletter";

import type { UnsubscribeConfirmProps } from "./types";

export const UnsubscribeConfirm = ({
  token,
  confirmLabel,
  successMessage,
  errorMessage,
}: UnsubscribeConfirmProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);
    setHasError(false);

    const response = await unsubscribeFromNewsletterClient(token);

    setIsSubmitting(false);

    if (!response.ok) {
      setHasError(true);
      return;
    }

    setIsDone(true);
  };

  if (isDone) {
    return <Alert severity="success">{successMessage}</Alert>;
  }

  return (
    <Stack spacing={2}>
      {hasError ? <Alert severity="error">{errorMessage}</Alert> : null}
      <Button
        variant="contained"
        size="large"
        loading={isSubmitting}
        onClick={handleClick}
        sx={{ alignSelf: "flex-start" }}
      >
        {confirmLabel}
      </Button>
    </Stack>
  );
};
