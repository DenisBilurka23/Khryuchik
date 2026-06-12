import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { PersonalDetailsSection, SectionCard } from "../../shared";
import { CountrySwitcher } from "../../../storefront-header/country-switcher";
import { LocaleSwitcher } from "../../../storefront-header/locale-switcher";

import type { SettingsSectionProps } from "./types";

export const SettingsSection = ({
  locale,
  country,
  availableLocales,
  profileEditor,
}: SettingsSectionProps) => {
  const t = useTranslations("accountPage");
  const localizedAccountPaths = {
    en: "/account",
    ru: "/ru/account",
  } as const;

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
          <Button variant="contained" startIcon={<SaveOutlinedIcon />}>
            {t("save")}
          </Button>
        }
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("newPasswordLabel")}
              type="password"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t("repeatPasswordLabel")}
              type="password"
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Stack>
  );
};

export type { SettingsSectionProps } from "./types";