"use client";

import { type SyntheticEvent, useState } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { changeAccountPasswordClient } from "@/client-api/account";
import { requestPasswordResetClient } from "@/client-api/auth";
import { AuthInputErrorCode } from "@/types/auth";
import { UserOperationErrorReason } from "@/types/users";

import { PersonalDetailsSection, SectionCard } from "../../shared";
import { CountrySwitcher } from "../../../storefront-header/country-switcher";
import { LocaleSwitcher } from "../../../storefront-header/locale-switcher";

import type { SettingsSectionProps } from "./types";

export const SettingsSection = ({
  locale,
  country,
  availableLocales,
  profileEditor,
  authProviders,
  userEmail,
}: SettingsSectionProps) => {
  const t = useTranslations("accountPage");
  const localizedAccountPaths = {
    en: "/account",
    ru: "/ru/account",
  } as const;

  const hasCredentials = authProviders.includes("credentials");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async () => {
    if (isSendingReset || resetSent) return;
    setIsSendingReset(true);
    await requestPasswordResetClient(userEmail, locale);
    setIsSendingReset(false);
    setResetSent(true);
  };

  const handlePasswordSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== repeatPassword) {
      setErrorMessage(t("securityPasswordMismatch"));
      return;
    }

    setIsSaving(true);

    const response = await changeAccountPasswordClient({
      currentPassword,
      newPassword,
    });

    setIsSaving(false);

    if (!response.ok) {
      const error = response.data?.error;

      if (error === UserOperationErrorReason.WrongPassword) {
        setErrorMessage(t("securityWrongPassword"));
      } else if (error === AuthInputErrorCode.PasswordTooShort) {
        setErrorMessage(t("securityPasswordTooShort"));
      } else {
        setErrorMessage(t("securityUnexpectedError"));
      }

      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");
    setSuccessMessage(t("securitySaveSuccess"));
  };

  return (
    <Stack spacing={3}>
      <PersonalDetailsSection {...profileEditor} />

      <SectionCard title={t("languageRegion")}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CountrySwitcher
              country={country}
              locale={locale}
              sx={{ width: "100%", minWidth: 0 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <LocaleSwitcher
              locale={locale}
              localizedPaths={localizedAccountPaths}
              availableLocales={availableLocales}
              sx={{ width: "100%", minWidth: 0 }}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title={t("notifications")}
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<NotificationsOutlinedIcon />}
            sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
          >
            {t("notifications")}
          </Button>
        }
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "18px",
            border: "1px solid #F0DFC8",
            bgcolor: "#fff",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            {t("notificationsEmailUpdatesTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("notificationsEmailUpdatesDescription")}
          </Typography>
        </Paper>
      </SectionCard>

      <SectionCard
        title={t("security")}
        action={
          <Button
            type="submit"
            form="security-password-form"
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            loading={isSaving}
          >
            {t("save")}
          </Button>
        }
      >
        <Stack
          id="security-password-form"
          component="form"
          spacing={2}
          onSubmit={handlePasswordSubmit}
        >
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}

          {hasCredentials ? (
            <Stack spacing={0.5}>
              <TextField
                fullWidth
                label={t("currentPasswordLabel")}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              {resetSent ? (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ pl: 0.5 }}
                >
                  {t("forgotPasswordLinkSent")}
                </Typography>
              ) : (
                <Button
                  variant="text"
                  size="small"
                  loading={isSendingReset}
                  onClick={() => void handleForgotPassword()}
                  sx={{
                    alignSelf: "flex-start",
                    p: 0,
                    minWidth: 0,
                    fontSize: "inherit",
                  }}
                >
                  {t("forgotPasswordLink")}
                </Button>
              )}
            </Stack>
          ) : null}

          <TextField
            fullWidth
            label={t("newPasswordLabel")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <TextField
            fullWidth
            label={t("repeatPasswordLabel")}
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export type { SettingsSectionProps } from "./types";
