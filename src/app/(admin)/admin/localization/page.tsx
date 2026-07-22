import type { Metadata } from "next";
import { Alert, Box, Checkbox, Stack, TextField } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { AdminLocaleCard } from "@/components/admin-localization-page-view/locale-card";
import { NewRegionFields } from "@/components/admin-localization-page-view/new-region-fields";
import { AdminRegionCard } from "@/components/admin-localization-page-view/region-card";
import {
  AdminCheckboxField,
  AdminConfirmSubmitButton,
  AdminPageHero,
  AdminSectionCard,
} from "@/components/admin-page-shared";
import {
  deleteAdminLocaleAction,
  deleteAdminRegionAction,
  saveAdminLocaleAction,
  saveAdminRegionAction,
} from "@/app/(admin)/admin/actions";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminLocalizationData } from "@/server/localization/localization.service";
import { resolveLocale } from "@/server/i18n/request-locale";

type AdminLocalizationPageProps = {
  searchParams: Promise<{ deleted?: string; error?: string; saved?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tLocalization = await getTranslations({
    locale,
    namespace: "adminPage.localization",
  });

  return createAdminMetadata(
    tLocalization("title"),
    tLocalization("description"),
    locale,
  );
};

const AdminLocalizationPage = async ({
  searchParams,
}: AdminLocalizationPageProps) => {
  const { deleted, error, saved } = await searchParams;
  const locale = await resolveLocale("admin");
  const [data, tLocalization] = await Promise.all([
    getAdminLocalizationData(locale),
    getTranslations({ locale, namespace: "adminPage.localization" }),
  ]);
  const labels = {
    eyebrow: tLocalization("eyebrow"),
    title: tLocalization("title"),
    description: tLocalization("description"),
    savedMessage: tLocalization("savedMessage"),
    deletedMessage: tLocalization("deletedMessage"),
    deleteProtectedMessage: tLocalization("deleteProtectedMessage"),
    deleteFailedMessage: tLocalization("deleteFailedMessage"),
    invalidCurrencyMessage: tLocalization("invalidCurrencyMessage"),
    languagesTitle: tLocalization("languagesTitle"),
    languagesDescription: tLocalization("languagesDescription"),
    newLanguageTitle: tLocalization("newLanguageTitle"),
    newLanguageDescription: tLocalization("newLanguageDescription"),
    regionsTitle: tLocalization("regionsTitle"),
    regionsDescription: tLocalization("regionsDescription"),
    newRegionTitle: tLocalization("newRegionTitle"),
    newRegionDescription: tLocalization("newRegionDescription"),
    saveButton: tLocalization("saveButton"),
    savingButton: tLocalization("savingButton"),
    fields: {
      code: tLocalization("fields.code"),
      regionCode: tLocalization("fields.regionCode"),
      currency: tLocalization("fields.currency"),
      sortOrder: tLocalization("fields.sortOrder"),
    },
    toggles: {
      isActive: tLocalization("toggles.isActive"),
      isDefault: tLocalization("toggles.isDefault"),
    },
  };

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={labels.eyebrow}
        title={labels.title}
        description={labels.description}
      />

      {saved === "1" ? <Alert severity="success">{labels.savedMessage}</Alert> : null}
      {deleted === "1" ? <Alert severity="success">{labels.deletedMessage}</Alert> : null}
      {error === "protected" ? <Alert severity="warning">{labels.deleteProtectedMessage}</Alert> : null}
      {error === "invalid-currency" ? <Alert severity="error">{labels.invalidCurrencyMessage}</Alert> : null}
      {error === "invalid-code" ? (
        <Alert severity="error">{labels.deleteFailedMessage}</Alert>
      ) : null}

      <AdminSectionCard title={labels.languagesTitle} description={labels.languagesDescription}>
        <Stack gap={2}>
          {data.locales.map((item) => (
            <AdminLocaleCard
              key={item.code}
              locale={item}
              saveAction={saveAdminLocaleAction}
              deleteAction={deleteAdminLocaleAction}
            />
          ))}
        </Stack>
      </AdminSectionCard>

      <AdminSectionCard title={labels.newLanguageTitle} description={labels.newLanguageDescription}>
        <form action={saveAdminLocaleAction}>
          <Stack gap={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
              <TextField label={labels.fields.code} name="code" required />
              <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={100} />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked />} label={labels.toggles.isActive} />
              <AdminCheckboxField control={<Checkbox name="isDefault" />} label={labels.toggles.isDefault} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <AdminConfirmSubmitButton
                variant="contained"
                label={labels.saveButton}
                pendingLabel={labels.savingButton}
              />
            </Box>
          </Stack>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title={labels.regionsTitle} description={labels.regionsDescription}>
        <Stack gap={2}>
          {data.regions.map((item) => (
            <AdminRegionCard
              key={item.code}
              region={item}
              locale={locale}
              saveAction={saveAdminRegionAction}
              deleteAction={deleteAdminRegionAction}
            />
          ))}
        </Stack>
      </AdminSectionCard>

      <AdminSectionCard title={labels.newRegionTitle} description={labels.newRegionDescription}>
        <form action={saveAdminRegionAction}>
          <Stack gap={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
              <NewRegionFields
                locale={locale}
                excludeCodes={data.regions.map((region) => region.code)}
              />
              <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={100} />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked />} label={labels.toggles.isActive} />
              <AdminCheckboxField control={<Checkbox name="isDefault" />} label={labels.toggles.isDefault} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <AdminConfirmSubmitButton
                variant="contained"
                label={labels.saveButton}
                pendingLabel={labels.savingButton}
              />
            </Box>
          </Stack>
        </form>
      </AdminSectionCard>
    </Stack>
  );
};

export default AdminLocalizationPage;
