"use client";

import { type SyntheticEvent, useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import {
  changeAccountPasswordClient,
  deleteAccountClient,
  getAccountNewsletterStatusClient,
  setAccountNewsletterSubscriptionClient,
} from "@/client-api/account";
import { requestPasswordResetClient } from "@/client-api/auth";
import { ModalButton } from "@/components/modal-button";
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
  availableCountries,
  profileEditor,
  authProviders,
  userEmail,
  onAccountDeletedAction,
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
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(
    null,
  );

  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isTogglingSubscription, setIsTogglingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let isActive = true;

    void getAccountNewsletterStatusClient().then((response) => {
      if (isActive && response.ok) {
        setIsSubscribed(Boolean(response.data?.subscribed));
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubscriptionToggle = async (nextSubscribed: boolean) => {
    setIsTogglingSubscription(true);
    setSubscriptionError(null);
    setIsSubscribed(nextSubscribed);

    const response = await setAccountNewsletterSubscriptionClient(
      nextSubscribed,
      locale,
    );

    setIsTogglingSubscription(false);

    if (!response.ok) {
      setIsSubscribed(!nextSubscribed);
      setSubscriptionError(t("notificationsUpdateError"));
    }
  };

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

  const handleDeleteAccount = async () => {
    setDeleteErrorMessage(null);

    const response = await deleteAccountClient({
      currentPassword: deletePassword,
    });

    if (!response.ok) {
      const error = response.data?.error;

      if (error === UserOperationErrorReason.WrongPassword) {
        setDeleteErrorMessage(t("deleteAccountWrongPassword"));
      } else if (error === UserOperationErrorReason.LastAdmin) {
        setDeleteErrorMessage(t("deleteAccountLastAdmin"));
      } else {
        setDeleteErrorMessage(t("deleteAccountUnexpectedError"));
      }

      return false;
    }

    onAccountDeletedAction();
  };

  return (
    <Stack spacing={3}>
      <PersonalDetailsSection {...profileEditor} />

      <SectionCard title={t("languageRegion")}>
        <Grid container spacing={2}>
          {availableCountries.length > 1 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <CountrySwitcher
                country={country}
                locale={locale}
                availableCountries={availableCountries}
                sx={{ width: "100%", minWidth: 0 }}
              />
            </Grid>
          )}
          <Grid
            size={{ xs: 12, md: availableCountries.length > 1 ? 6 : 12 }}
          >
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
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }}>
                {t("notificationsEmailUpdatesTitle")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {t("notificationsEmailUpdatesDescription")}
              </Typography>
            </Box>
            <Switch
              checked={isSubscribed ?? false}
              disabled={isSubscribed === null || isTogglingSubscription}
              onChange={(event) =>
                void handleSubscriptionToggle(event.target.checked)
              }
              slotProps={{
                input: { "aria-label": t("notificationsEmailUpdatesTitle") },
              }}
            />
          </Box>
          {subscriptionError ? (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {subscriptionError}
            </Alert>
          ) : null}
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

      <SectionCard title={t("deleteAccountTitle")}>
        <Stack spacing={2}>
          {deleteErrorMessage ? (
            <Alert severity="error">{deleteErrorMessage}</Alert>
          ) : null}

          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t("deleteAccountText")}
          </Typography>

          {hasCredentials ? (
            <TextField
              fullWidth
              label={t("deleteAccountPasswordLabel")}
              type="password"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeleteErrorMessage(null);
              }}
              autoComplete="current-password"
            />
          ) : null}

          <ModalButton
            label={t("deleteAccountButton")}
            color="error"
            variant="outlined"
            icon={<DeleteOutlineOutlinedIcon />}
            disabled={hasCredentials && deletePassword.trim().length === 0}
            onConfirmAction={handleDeleteAccount}
            dialogTitle={t("deleteAccountDialogTitle")}
            dialogDescription={t("deleteAccountDialogDescription")}
            confirmLabel={t("deleteAccountConfirmButton")}
            cancelLabel={t("deleteAccountCancelButton")}
          />
        </Stack>
      </SectionCard>
    </Stack>
  );
};

export type { SettingsSectionProps } from "./types";
