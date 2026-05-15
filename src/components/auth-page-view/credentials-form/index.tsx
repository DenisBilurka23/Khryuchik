import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { AuthCredentialsFormProps } from "./types";

export const AuthCredentialsForm = ({
  email,
  password,
  errorMessage,
  isLoading,
  forgotPasswordHref,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AuthCredentialsFormProps) => {
  const t = useTranslations("authPage");

  return (
    <AuthSectionCard>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <AuthSectionHeader
            title={t("credentialsTitle")}
            description={t("credentialsLead")}
            icon={<LockOutlinedIcon />}
            iconBackground="#FFF2D6"
          />

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

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
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
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
            {t("loginButton")}
          </Button>

          <AuthLinkPrompt
            href={forgotPasswordHref}
            label={t("forgotPasswordLinkLabel")}
          />
        </Stack>
      </Box>
    </AuthSectionCard>
  );
};

export type { AuthCredentialsFormProps } from "./types";