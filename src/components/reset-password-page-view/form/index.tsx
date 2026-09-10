import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { AuthField } from "@/components/auth-page-shared";
import { IconTile, Plate } from "@/components/primitives";

import type { ResetPasswordFormProps } from "./types";

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

const fieldsSx = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: 2,
} as const;

const submitSx = {
  minHeight: 54,
  mt: 3,
  borderRadius: "var(--radius-field)",
  fontSize: 17,
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": { background: "var(--color-action-hover)" },
} as const;

export const ResetPasswordForm = ({
  password,
  confirmPassword,
  errorMessage,
  successMessage,
  isSubmitting,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps) => {
  const t = useTranslations("resetPasswordPage");

  return (
    <Plate pad="none" sx={cardSx}>
      <Box sx={headerSx}>
        <IconTile tone="accent" sx={iconTileSx}>
          <LockResetOutlinedIcon />
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

        <Box sx={fieldsSx}>
          <AuthField
            id="reset-password"
            type="password"
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            value={password}
            autoComplete="new-password"
            onChange={onPasswordChange}
            showPasswordLabel={t("showPassword")}
            hidePasswordLabel={t("hidePassword")}
          />

          <AuthField
            id="reset-confirm-password"
            type="password"
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            autoComplete="new-password"
            onChange={onConfirmPasswordChange}
            showPasswordLabel={t("showPassword")}
            hidePasswordLabel={t("hidePassword")}
          />
        </Box>

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

export type { ResetPasswordFormProps } from "./types";
