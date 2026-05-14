import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

import { PersonalDetailsSection, SectionCard } from "../../shared";
import { CountrySwitcher } from "../../../storefront-header/country-switcher";
import { LocaleSwitcher } from "../../../storefront-header/locale-switcher";

import type { SettingsSectionProps } from "./types";

export const SettingsSection = ({
  locale,
  country,
  dictionary,
  firstName,
  lastName,
  email,
  phone,
  isEditingProfile,
  isSavingProfile,
  isEmailEditable,
  profileError,
  profileSuccess,
  onBeginEdit,
  onCancel,
  onSave,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
}: SettingsSectionProps) => {
  const localizedAccountPaths = {
    en: "/account",
    ru: "/ru/account",
  } as const;

  return (
    <Stack spacing={3}>
      <PersonalDetailsSection
        dictionary={dictionary}
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        isEditingProfile={isEditingProfile}
        isSavingProfile={isSavingProfile}
        isEmailEditable={isEmailEditable}
        profileError={profileError}
        profileSuccess={profileSuccess}
        onBeginEdit={onBeginEdit}
        onCancel={onCancel}
        onSave={onSave}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onEmailChange={onEmailChange}
        onPhoneChange={onPhoneChange}
      />

      <SectionCard title={dictionary.languageRegion}>
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
              sx={{ width: "100%", minWidth: 0 }}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title={dictionary.notifications}
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<NotificationsOutlinedIcon />}
            sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
          >
            {dictionary.notifications}
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
            {dictionary.notificationsEmailUpdatesTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {dictionary.notificationsEmailUpdatesDescription}
          </Typography>
        </Paper>
      </SectionCard>

      <SectionCard
        title={dictionary.security}
        action={
          <Button variant="contained" startIcon={<SaveOutlinedIcon />}>
            {dictionary.save}
          </Button>
        }
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={dictionary.newPasswordLabel}
              type="password"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={dictionary.repeatPasswordLabel}
              type="password"
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Stack>
  );
};

export type { SettingsSectionProps } from "./types";