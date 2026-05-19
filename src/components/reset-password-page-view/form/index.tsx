import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { ResetPasswordFormProps } from "./types";

export const ResetPasswordForm = ({
  password,
  confirmPassword,
  errorMessage,
  successMessage,
  isSubmitting,
  loginHref,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps) => {
  const t = useTranslations("resetPasswordPage");

  return (
    <AuthSectionCard>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <AuthSectionHeader
            title={t("submitButton")}
            icon={<LockResetOutlinedIcon />}
            iconBackground="#FFF2D6"
          />

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
          />
          <TextField
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            type="password"
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{ alignSelf: "flex-start" }}
          >
            {t("submitButton")}
          </Button>

          <AuthLinkPrompt href={loginHref} label={t("loginLinkLabel")} />
        </Stack>
      </Box>
    </AuthSectionCard>
  );
};

export type { ResetPasswordFormProps } from "./types";