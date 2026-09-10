import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { AuthField } from "@/components/auth-page-shared";
import { IconTile, Plate } from "@/components/primitives";

import type { ForgotPasswordFormProps } from "./types";

const cardSx = {
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-floating)",
  p: { xs: "22px 18px", md: "32px 34px" },
} as const;

const headerSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.75,
  mb: 3,
} as const;

const iconTileSx = {
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent-pale)",
  color: "var(--color-action)",
} as const;

const titleSx = {
  fontSize: { xs: 24, md: 30 },
  lineHeight: 1.2,
} as const;

const alertSx = {
  mb: 2.5,
  borderRadius: "var(--radius-field)",
} as const;

const submitSx = {
  minHeight: 54,
  mt: 3,
  borderRadius: "var(--radius-field)",
  fontSize: 17,
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": { background: "var(--color-action-hover)" },
} as const;

export const ForgotPasswordForm = ({
  email,
  errorMessage,
  successMessage,
  isSubmitting,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const t = useTranslations("forgotPasswordPage");

  return (
    <Plate pad="none" sx={cardSx}>
      <Box sx={headerSx}>
        <IconTile tone="accent" sx={iconTileSx}>
          <MailOutlineIcon />
        </IconTile>

        <Typography variant="h3" sx={titleSx}>
          {t("formTitle")}
        </Typography>
      </Box>

      <Box component="form" onSubmit={onSubmit}>
        <Box aria-live="polite">
          {errorMessage ? (
            <Alert severity="error" sx={alertSx}>
              {errorMessage}
            </Alert>
          ) : null}

          {successMessage ? (
            <Alert severity="success" sx={alertSx}>
              {successMessage}
            </Alert>
          ) : null}
        </Box>

        <AuthField
          id="forgot-password-email"
          type="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          value={email}
          autoComplete="email"
          onChange={onEmailChange}
        />

        <Button
          type="submit"
          variant="contained"
          sx={submitSx}
          loading={isSubmitting}
          fullWidth
        >
          {t("submitButton")}
        </Button>
      </Box>
    </Plate>
  );
};

export type { ForgotPasswordFormProps } from "./types";
