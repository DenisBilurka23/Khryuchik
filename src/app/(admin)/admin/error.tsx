"use client";

import { Alert, Button, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

type AdminErrorPageProps = {
  error: Error & { digest?: string; statusCode?: number; cause?: unknown };
  reset: () => void;
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
  const tError = useTranslations("adminPage.errorBoundary");
  const tActions = useTranslations("adminPage.shared.actions");
  const isPayloadTooLarge = isPayloadTooLargeError(error);
  const errorMessage = isPayloadTooLarge
    ? tError("payloadTooLargeMessage")
    : tError("genericMessage");

  return (
    <Stack gap={2} sx={{ maxWidth: 720, px: { xs: 2, md: 3 }, py: 4 }}>
      <Typography variant="h4" fontWeight={800}>
        {tError("title")}
      </Typography>
      <Alert severity="error">
        {errorMessage}
      </Alert>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
        <Button variant="contained" onClick={() => reset()}>
          {tError("retryButton")}
        </Button>
        <Button variant="outlined" href="/admin/products">
          {tActions("backToProducts")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AdminErrorPage;