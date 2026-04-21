import type { Metadata } from "next";
import { Alert, Box, Button, Checkbox, Stack, TextField } from "@mui/material";

import { AdminCheckboxField, AdminPageHero, AdminSectionCard, AdminStatusChip } from "@/components/admin-page-shared";
import { saveAdminCategoryAction } from "@/app/(admin)/admin/actions";
import { getAdminCategories } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { getAdminCategoryLabel } from "@/utils/admin";

type AdminCategoriesPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const { dictionary } = await getAdminPageContext();

  return createAdminMetadata(
    dictionary.categories.title,
    dictionary.categories.description,
  );
};

const AdminCategoriesPage = async ({ searchParams }: AdminCategoriesPageProps) => {
  const { saved } = await searchParams;
  const [{ dictionary, locale }, categories] = await Promise.all([
    getAdminPageContext(),
    getAdminCategories(),
  ]);
  const shared = dictionary.shared;
  const labels = dictionary.categories;

  return (
    <Stack gap={3}>
      <AdminPageHero eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />

      {saved === "1" ? <Alert severity="success">{labels.savedMessage}</Alert> : null}

      <AdminSectionCard title={labels.newCategoryTitle} description={labels.newCategoryDescription}>
        <form action={saveAdminCategoryAction}>
          <Stack gap={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
              <TextField label={labels.fields.key} name="key" required />
              <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={100} />
              <TextField label={labels.fields.ruLabel} name="ru.label" required />
              <TextField label={labels.fields.enLabel} name="en.label" required />
              <TextField label={labels.fields.ruDescription} name="ru.description" />
              <TextField label={labels.fields.enDescription} name="en.description" />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked />} label={labels.toggles.isActive} />
              <AdminCheckboxField control={<Checkbox name="visibleInShop" defaultChecked />} label={labels.toggles.visibleInShop} />
              <AdminCheckboxField control={<Checkbox name="visibleInHomeTabs" />} label={labels.toggles.visibleInHomeTabs} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">{labels.saveButton}</Button>
            </Box>
          </Stack>
        </form>
      </AdminSectionCard>

      <Stack gap={2}>
        {categories.map((category) => (
          <AdminSectionCard
            key={category.key}
            title={getAdminCategoryLabel(category.translations, locale) || category.key}
            description={`/${category.key} • ${category.itemsCount} ${labels.itemsLabel}`}
            action={<Stack direction="row" gap={1} flexWrap="wrap"><AdminStatusChip label={category.isActive ? shared.status.active : shared.status.hidden} tone={category.isActive ? "success" : "neutral"} /><AdminStatusChip label={category.visibleInHomeTabs ? shared.status.homeTabs : shared.status.shopOnly} tone={category.visibleInHomeTabs ? "info" : "neutral"} /></Stack>}
          >
            <form action={saveAdminCategoryAction}>
              <Stack gap={2}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
                  <TextField label={labels.fields.key} name="key" defaultValue={category.key} required slotProps={{ input: { readOnly: true } }} />
                  <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={category.sortOrder} />
                  <TextField label={labels.fields.ruLabel} name="ru.label" defaultValue={category.translations.ru?.label ?? ""} required />
                  <TextField label={labels.fields.enLabel} name="en.label" defaultValue={category.translations.en?.label ?? ""} required />
                  <TextField label={labels.fields.ruDescription} name="ru.description" defaultValue={category.translations.ru?.description ?? ""} />
                  <TextField label={labels.fields.enDescription} name="en.description" defaultValue={category.translations.en?.description ?? ""} />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked={category.isActive} />} label={labels.toggles.isActive} />
                  <AdminCheckboxField control={<Checkbox name="visibleInShop" defaultChecked={category.visibleInShop} />} label={labels.toggles.visibleInShop} />
                  <AdminCheckboxField control={<Checkbox name="visibleInHomeTabs" defaultChecked={category.visibleInHomeTabs} />} label={labels.toggles.visibleInHomeTabs} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="outlined">{labels.updateButton}</Button>
                </Box>
              </Stack>
            </form>
          </AdminSectionCard>
        ))}
      </Stack>
    </Stack>
  );
};

export default AdminCategoriesPage;