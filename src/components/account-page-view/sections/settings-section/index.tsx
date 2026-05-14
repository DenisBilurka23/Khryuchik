import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

import { PersonalDetailsSection, SectionCard } from "../../shared";

import type { SettingsSectionProps } from "./types";

export const SettingsSection = ({
  locale,
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
            <TextField
              fullWidth
              label={locale === "ru" ? "Язык" : "Language"}
              defaultValue={locale === "ru" ? "Русский" : "English"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={locale === "ru" ? "Регион магазина" : "Store region"}
              defaultValue={locale === "ru" ? "Беларусь" : "Belarus"}
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
          <Typography sx={{ fontWeight: 700 }}>Email updates</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {locale === "ru"
              ? "Новые книги, статусы заказов и сезонные коллекции."
              : "New books, order updates, and seasonal collections."}
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
              label={locale === "ru" ? "Новый пароль" : "New password"}
              type="password"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={locale === "ru" ? "Повторите пароль" : "Repeat password"}
              type="password"
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Stack>
  );
};

export type { SettingsSectionProps } from "./types";