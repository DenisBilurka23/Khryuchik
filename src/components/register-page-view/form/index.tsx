import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { RegisterFormProps } from "./types";

export const RegisterForm = ({
  dictionary,
  name,
  email,
  phone,
  password,
  confirmPassword,
  errorMessage,
  isSubmitting,
  loginHref,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) => (
  <AuthSectionCard>
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <AuthSectionHeader
          title={dictionary.submitButton}
          icon={<BadgeOutlinedIcon />}
          iconBackground="#FCE5EA"
        />

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          label={dictionary.nameLabel}
          placeholder={dictionary.namePlaceholder}
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          autoComplete="name"
          required
          fullWidth
        />
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
          label={dictionary.phoneLabel}
          placeholder={dictionary.phonePlaceholder}
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          autoComplete="tel"
          required
          fullWidth
        />
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

        <AuthLinkPrompt
          href={loginHref}
          label={dictionary.loginLinkLabel}
          prefix={dictionary.loginPrompt}
        />
      </Stack>
    </Box>
  </AuthSectionCard>
);

export type { RegisterFormProps } from "./types";