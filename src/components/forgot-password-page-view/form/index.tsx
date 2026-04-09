import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { ForgotPasswordFormProps } from "./types";

export const ForgotPasswordForm = ({
  dictionary,
  email,
  errorMessage,
  successMessage,
  isSubmitting,
  loginHref,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) => (
  <AuthSectionCard>
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <AuthSectionHeader
          title={dictionary.submitButton}
          icon={<MailOutlineIcon />}
          iconBackground="#FCE5EA"
        />

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

        <TextField
          label={dictionary.emailLabel}
          placeholder={dictionary.emailPlaceholder}
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          autoComplete="email"
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

        <AuthLinkPrompt
          href={loginHref}
          label={dictionary.loginLinkLabel}
          prefix={dictionary.loginPrompt}
        />
      </Stack>
    </Box>
  </AuthSectionCard>
);

export type { ForgotPasswordFormProps } from "./types";