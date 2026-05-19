import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { ForgotPasswordFormProps } from "./types";

export const ForgotPasswordForm = ({
  email,
  errorMessage,
  successMessage,
  isSubmitting,
  loginHref,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const t = useTranslations("forgotPasswordPage");

  return (
    <AuthSectionCard>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <AuthSectionHeader
            title={t("submitButton")}
            icon={<MailOutlineIcon />}
            iconBackground="#FCE5EA"
          />

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

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

export type { ForgotPasswordFormProps } from "./types";