import type { Metadata } from "next";
import { Alert, Box, Button, Checkbox, Stack, TextField } from "@mui/material";

import { AdminCategoryCard } from "@/components/admin-categories-page-view/category-card";
import { AdminCheckboxField, AdminPageHero, AdminSectionCard } from "@/components/admin-page-shared";
import { deleteAdminCategoryAction, saveAdminCategoryAction } from "@/app/(admin)/admin/actions";
import { getAdminCategories } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { getAdminCategoryLabel } from "@/utils/admin";

type AdminCategoriesPageProps = {
  searchParams: Promise<{ deleted?: string; error?: string; saved?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const { dictionary } = await getAdminPageContext();

  return createAdminMetadata(
    dictionary.categories.title,
    dictionary.categories.description,
  );
};

const AdminCategoriesPage = async ({ searchParams }: AdminCategoriesPageProps) => {
  const { deleted, error, saved } = await searchParams;
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
      {deleted === "1" ? <Alert severity="success">{labels.deletedMessage}</Alert> : null}
      {error === "not-empty" ? <Alert severity="warning">{labels.deleteBlockedMessage}</Alert> : null}
      {error === "protected" ? <Alert severity="warning">{labels.deleteProtectedMessage}</Alert> : null}
      {error === "invalid-key" ? <Alert severity="error">{labels.deleteFailedMessage}</Alert> : null}

      <AdminSectionCard title={labels.newCategoryTitle} description={labels.newCategoryDescription}>
        <form action={saveAdminCategoryAction}>
          <Stack gap={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
              <TextField label={labels.fields.key} name="key" required />
              <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={100} />
              <TextField label={labels.fields.ruLabel} name="ru.label" required />
              <TextField label={labels.fields.enLabel} name="en.label" required />
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
          <AdminCategoryCard
            key={category.key}
            category={category}
            title={getAdminCategoryLabel(category.translations, locale) || category.key}
            labels={labels}
            sharedStatus={shared.status}
            saveAction={saveAdminCategoryAction}
            deleteAction={deleteAdminCategoryAction}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default AdminCategoriesPage;