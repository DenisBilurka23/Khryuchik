"use client";

import { useState } from "react";
import { Button, Paper, Rating, Stack, TextField, Typography } from "@mui/material";
import { normalizeAdminDate } from "@/utils/admin";

import type { AdminReviewsFieldProps } from "./types";

export const AdminReviewsField = ({
  name,
  title,
  helperText,
  initialReviews,
  authorLabel,
  reviewLabel,
  ratingLabel,
  dateLabel,
  addButtonLabel,
  removeButtonLabel,
}: AdminReviewsFieldProps) => {
  const [reviews, setReviews] = useState(
    initialReviews.length > 0
      ? initialReviews.map((review) => ({ ...review, date: normalizeAdminDate(review.date) }))
      : [{ id: `${name}-1`, author: "", text: "", rating: 5, date: normalizeAdminDate("") }],
  );

  return (
    <Stack gap={1.5}>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          reviews
            .filter((review) => review.author.trim() && review.text.trim())
            .map((review, index) => ({ ...review, id: review.id || `${name}-${index + 1}` })),
        )}
      />
      {title ? (
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, color: "text.primary" }}>
          {title}
        </Typography>
      ) : null}
      {helperText ? (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      ) : null}
      <Stack gap={1.5}>
        {reviews.map((review, index) => (
          <Paper key={review.id || `${name}-${index}`} variant="outlined" sx={{ p: 1.5, borderRadius: "18px" }}>
            <Stack gap={1.5}>
              <TextField
                label={authorLabel}
                value={review.author}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setReviews((currentReviews) => currentReviews.map((item, itemIndex) => (
                    itemIndex === index ? { ...item, author: nextValue } : item
                  )));
                }}
                fullWidth
              />
              <TextField
                label={reviewLabel}
                value={review.text}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setReviews((currentReviews) => currentReviews.map((item, itemIndex) => (
                    itemIndex === index ? { ...item, text: nextValue } : item
                  )));
                }}
                multiline
                minRows={4}
                fullWidth
              />
              <Stack direction={{ xs: "column", md: "row" }} gap={2} alignItems={{ xs: "flex-start", md: "center" }}>
                <Stack gap={0.5}>
                  <span>{ratingLabel}</span>
                  <Rating
                    value={review.rating}
                    onChange={(_, nextValue) => {
                      setReviews((currentReviews) => currentReviews.map((item, itemIndex) => (
                        itemIndex === index ? { ...item, rating: nextValue ?? 5 } : item
                      )));
                    }}
                  />
                </Stack>
                <TextField
                  label={dateLabel}
                  type="date"
                  value={normalizeAdminDate(review.date)}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setReviews((currentReviews) => currentReviews.map((item, itemIndex) => (
                      itemIndex === index ? { ...item, date: nextValue } : item
                    )));
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Stack>
              <Button
                type="button"
                variant="text"
                color="inherit"
                sx={{ alignSelf: "flex-start" }}
                onClick={() => {
                  setReviews((currentReviews) => currentReviews.length > 1
                    ? currentReviews.filter((_, itemIndex) => itemIndex !== index)
                    : [{ id: `${name}-1`, author: "", text: "", rating: 5, date: normalizeAdminDate("") }]);
                }}
              >
                {removeButtonLabel}
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button
        type="button"
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
        onClick={() => {
          setReviews((currentReviews) => [
            ...currentReviews,
            {
              id: `${name}-${currentReviews.length + 1}`,
              author: "",
              text: "",
              rating: 5,
              date: normalizeAdminDate(""),
            },
          ]);
        }}
      >
        {addButtonLabel}
      </Button>
    </Stack>
  );
};

export type { AdminReviewsFieldProps } from "./types";