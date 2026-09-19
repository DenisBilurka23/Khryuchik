"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ModalButton } from "@/components/modal-button";
import { Plate } from "@/components/primitives";
import { useAccountSettingsForm } from "@/hooks/useAccountSettingsForm";
import { secondaryButtonSx } from "@/theme/sx";

import {
  AccountPasswordField,
  PersonalDetailsSection,
  SectionCard,
} from "../../shared";
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

  const { password, deletion, newsletter } = useAccountSettingsForm({
    locale,
    userEmail,
    onAccountDeletedAction,
  });

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
          <Grid size={{ xs: 12, md: availableCountries.length > 1 ? 6 : 12 }}>
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
            sx={secondaryButtonSx}
          >
            {t("notifications")}
          </Button>
        }
      >
        <Plate pad="sm">
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
              checked={newsletter.isSubscribed ?? false}
              disabled={
                newsletter.isSubscribed === null || newsletter.isToggling
              }
              onChange={(event) => void newsletter.toggle(event.target.checked)}
              slotProps={{
                input: { "aria-label": t("notificationsEmailUpdatesTitle") },
              }}
            />
          </Box>
          {newsletter.errorMessage ? (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {newsletter.errorMessage}
            </Alert>
          ) : null}
        </Plate>
      </SectionCard>

      <SectionCard
        title={t("security")}
        action={
          <Button
            type="submit"
            form="security-password-form"
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            loading={password.isSaving}
          >
            {t("save")}
          </Button>
        }
      >
        <Stack
          id="security-password-form"
          component="form"
          spacing={2}
          onSubmit={password.submit}
        >
          {password.errorMessage ? (
            <Alert severity="error">{password.errorMessage}</Alert>
          ) : null}
          {password.successMessage ? (
            <Alert severity="success">{password.successMessage}</Alert>
          ) : null}

          {hasCredentials ? (
            <Stack spacing={0.5}>
              <AccountPasswordField
                label={t("currentPasswordLabel")}
                value={password.currentPassword}
                onChange={password.setCurrentPassword}
                autoComplete="current-password"
                showPasswordLabel={t("showPassword")}
                hidePasswordLabel={t("hidePassword")}
                required
              />
              {password.resetSent ? (
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
                  loading={password.isSendingReset}
                  onClick={() => void password.requestReset()}
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

          <AccountPasswordField
            label={t("newPasswordLabel")}
            value={password.newPassword}
            onChange={password.setNewPassword}
            autoComplete="new-password"
            showPasswordLabel={t("showPassword")}
            hidePasswordLabel={t("hidePassword")}
            required
          />

          <AccountPasswordField
            label={t("repeatPasswordLabel")}
            value={password.repeatPassword}
            onChange={password.setRepeatPassword}
            autoComplete="new-password"
            showPasswordLabel={t("showPassword")}
            hidePasswordLabel={t("hidePassword")}
            required
          />
        </Stack>
      </SectionCard>

      <SectionCard title={t("deleteAccountTitle")}>
        <Stack spacing={2}>
          {deletion.errorMessage ? (
            <Alert severity="error">{deletion.errorMessage}</Alert>
          ) : null}

          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t("deleteAccountText")}
          </Typography>

          {hasCredentials ? (
            <AccountPasswordField
              label={t("deleteAccountPasswordLabel")}
              value={deletion.password}
              onChange={deletion.setPassword}
              autoComplete="current-password"
              showPasswordLabel={t("showPassword")}
              hidePasswordLabel={t("hidePassword")}
            />
          ) : null}

          <ModalButton
            label={t("deleteAccountButton")}
            color="error"
            variant="outlined"
            icon={<DeleteOutlineOutlinedIcon />}
            disabled={hasCredentials && deletion.password.trim().length === 0}
            onConfirmAction={deletion.confirm}
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
