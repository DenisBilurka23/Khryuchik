"use client";

import { Alert, Button, Stack, Typography } from "@mui/material";

import {
  ADMIN_LOCALE_COOKIE_NAME,
  defaultLocale,
  isLocale,
} from "@/i18n/config";
import { dictionariesByLocale } from "@/i18n/runtime-dictionaries";

type AdminErrorPageProps = {
  error: Error & { digest?: string; statusCode?: number; cause?: unknown };
  reset: () => void;
};

const getAdminLocaleFromCookie = () => {
  if (typeof document === "undefined") {
    return defaultLocale;
  }

  const cookieValue = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_LOCALE_COOKIE_NAME}=`))
    ?.split("=")[1];

  const decodedValue = cookieValue ? decodeURIComponent(cookieValue) : undefined;

  return decodedValue && isLocale(decodedValue) ? decodedValue : defaultLocale;
};

const getErrorMessage = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as { message?: unknown };

  return typeof candidate.message === "string" ? candidate.message : undefined;
};

const isPayloadTooLargeError = (
  error: Error & { statusCode?: number; cause?: unknown },
) => {
  const messages = [error.message, getErrorMessage(error.cause)]
    .filter((message): message is string => Boolean(message))
    .map((message) => message.toLowerCase());

  return (
    error.statusCode === 413 ||
    messages.some(
      (message) =>
        message.includes("body exceeded") ||
        message.includes("413") ||
        message.includes("payload too large"),
    )
  );
};

const AdminErrorPage = ({ error, reset }: AdminErrorPageProps) => {
  console.error("Admin route error boundary", error);
  const dictionary =
    dictionariesByLocale[getAdminLocaleFromCookie()].adminPage;
  const isPayloadTooLarge = isPayloadTooLargeError(error);
  const errorMessage = isPayloadTooLarge
    ? dictionary.errorBoundary.payloadTooLargeMessage
    : dictionary.errorBoundary.genericMessage;

  return (
    <Stack gap={2} sx={{ maxWidth: 720, px: { xs: 2, md: 3 }, py: 4 }}>
      <Typography variant="h4" fontWeight={800}>
        {dictionary.errorBoundary.title}
      </Typography>
      <Alert severity="error">
        {errorMessage}
      </Alert>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
        <Button variant="contained" onClick={() => reset()}>
          {dictionary.errorBoundary.retryButton}
        </Button>
        <Button variant="outlined" href="/admin/products">
          {dictionary.shared.actions.backToProducts}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdminErrorPage;