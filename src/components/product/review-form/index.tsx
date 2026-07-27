"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { submitReview } from "@/client-api/reviews";

import type { ReviewFormProps } from "../types";

type FormStatus = "idle" | "submitting" | "success";

export const ReviewForm = ({
  isAuthenticated,
  productId,
  productSlug,
  loginHref,
  labels,
}: ReviewFormProps) => {
  const [rating, setRating] = useState<number | null>(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <Alert severity="info" sx={{ borderRadius: "16px" }}>
        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="body2">{labels.loginPrompt}</Typography>
          <Link href={loginHref} style={{ textDecoration: "none" }}>
            <MuiLink component="span" underline="hover" sx={{ fontWeight: 700 }}>
              {labels.loginCta}
            </MuiLink>
          </Link>
        </Stack>
      </Alert>
    );
  }

  if (status === "success") {
    return (
      <Alert severity="success" sx={{ borderRadius: "16px" }}>
        <Typography sx={{ fontWeight: 700 }}>{labels.successTitle}</Typography>
        <Typography variant="body2">{labels.successText}</Typography>
      </Alert>
    );
  }

  const resolveErrorMessage = (code?: string) => {
    switch (code) {
      case "already_reviewed":
        return labels.errors.alreadyReviewed;
      case "empty_text":
        return labels.errors.emptyText;
      case "invalid_rating":
        return labels.errors.invalidRating;
      default:
        return labels.errors.generic;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating || rating < 1) {
      setError(labels.errors.invalidRating);
      return;
    }

    if (text.trim().length === 0) {
      setError(labels.errors.emptyText);
      return;
    }

    setError(null);
    setStatus("submitting");

    const response = await submitReview({
      productId,
      productSlug,
      rating,
      text: text.trim(),
    });

    if (response.ok && response.data?.ok) {
      setStatus("success");
      return;
    }

    setError(resolveErrorMessage(response.data?.error));
    setStatus("idle");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "1px solid #F0DFC8",
        bgcolor: "#fff",
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 2 }}>{labels.title}</Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {labels.ratingLabel}
          </Typography>
          <Rating
            value={rating}
            onChange={(_event, value) => setRating(value)}
          />
        </Box>

        <TextField
          label={labels.textLabel}
          placeholder={labels.textPlaceholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        {error ? (
          <Alert severity="error" sx={{ borderRadius: "16px" }}>
            {error}
          </Alert>
        ) : null}

        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? labels.submitting : labels.submit}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export type { ReviewFormProps } from "../types";
