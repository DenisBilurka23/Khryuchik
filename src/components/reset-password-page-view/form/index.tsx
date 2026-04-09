import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { ResetPasswordFormProps } from "./types";

export const ResetPasswordForm = ({
  dictionary,
  password,
  confirmPassword,
  errorMessage,
  successMessage,
  isSubmitting,
  loginHref,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps) => (
  <AuthSectionCard>
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <AuthSectionHeader
          title={dictionary.submitButton}
          icon={<LockResetOutlinedIcon />}
          iconBackground="#FFF2D6"
        />

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

        <TextField
          label={dictionary.passwordLabel}
          placeholder={dictionary.passwordPlaceholder}
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          autoComplete="new-password"
          required
          fullWidth
        />
        <TextField
          label={dictionary.confirmPasswordLabel}
          placeholder={dictionary.confirmPasswordPlaceholder}
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
          {dictionary.submitButton}
        </Button>

        <AuthLinkPrompt href={loginHref} label={dictionary.loginLinkLabel} />
      </Stack>
    </Box>
  </AuthSectionCard>
);

export type { ResetPasswordFormProps } from "./types";