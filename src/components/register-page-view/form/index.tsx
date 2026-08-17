import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { RegisterFormProps } from "./types";

export const RegisterForm = ({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  errorMessage,
  isSubmitting,
  loginHref,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) => {
  const t = useTranslations("registerPage");

  return (
    <AuthSectionCard>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <AuthSectionHeader
            title={t("submitButton")}
            icon={<BadgeOutlinedIcon />}
            iconBackground="#FCE5EA"
          />

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <TextField
            label={t("firstNameLabel")}
            placeholder={t("firstNamePlaceholder")}
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            autoComplete="given-name"
            required
            fullWidth
          />
          <TextField
            label={t("lastNameLabel")}
            placeholder={t("lastNamePlaceholder")}
            value={lastName}
            onChange={(event) => onLastNameChange(event.target.value)}
            autoComplete="family-name"
            required
            fullWidth
          />
          <TextField
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            autoComplete="email"
            required
            fullWidth
          />
          <TextField
            label={t("phoneLabel")}
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            autoComplete="tel"
            required
            fullWidth
          />
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

          <AuthLinkPrompt
            href={loginHref}
            label={t("loginLinkLabel")}
            prefix={t("loginPrompt")}
          />
        </Stack>
      </Box>
    </AuthSectionCard>
  );
};

export type { RegisterFormProps } from "./types";