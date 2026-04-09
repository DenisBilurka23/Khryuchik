import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { AuthCredentialsFormProps } from "./types";

export const AuthCredentialsForm = ({
  dictionary,
  email,
  password,
  errorMessage,
  isLoading,
  forgotPasswordHref,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AuthCredentialsFormProps) => (
  <AuthSectionCard>
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <AuthSectionHeader
          title={dictionary.credentialsTitle}
          description={dictionary.credentialsLead}
          icon={<LockOutlinedIcon />}
          iconBackground="#FFF2D6"
        />

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

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
        <TextField
          label={dictionary.passwordLabel}
          placeholder={dictionary.passwordPlaceholder}
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isLoading}
          sx={{ alignSelf: "flex-start" }}
        >
          {dictionary.loginButton}
        </Button>

        <AuthLinkPrompt
          href={forgotPasswordHref}
          label={dictionary.forgotPasswordLinkLabel}
        />
      </Stack>
    </Box>
  </AuthSectionCard>
);

export type { AuthCredentialsFormProps } from "./types";