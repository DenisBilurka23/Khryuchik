import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Alert, Stack } from "@mui/material";

import { AdminProductForm } from "@/components/admin-product-form";
import { getAdminProductEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";

import { deleteAdminProductAction, saveAdminProductAction } from "../../../actions";

type EditAdminProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export const generateMetadata = async ({
  params,
}: EditAdminProductPageProps): Promise<Metadata> => {
  const [locale, { id }] = await Promise.all([
    resolveLocale("admin"),
    params,
  ]);
  const tProductForm = await getTranslations({
    locale,
    namespace: "adminPage.productForm",
  });

  return createAdminMetadata(
    `${tProductForm("editTitlePrefix")}: ${id}`,
    tProductForm("editDescription"),
    locale,
  );
};

const EditAdminProductPage = async ({
  params,
  searchParams,
}: EditAdminProductPageProps) => {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const locale = await resolveLocale("admin");
  const tProductForm = await getTranslations({
    locale,
    namespace: "adminPage.productForm",
  });
  const editorData = await getAdminProductEditorData(id, locale);

  return (
    <Stack gap={2}>
      {saved === "1" ? <Alert severity="success">{tProductForm("savedMessage")}</Alert> : null}
      <AdminProductForm
        key={`${id}:${saved ?? "0"}:${error ?? "ok"}`}
        locale={locale}
        payload={editorData.payload}
        categories={editorData.categories}
        initialRelatedProductOptions={editorData.initialRelatedProductOptions}
        selectedRelatedProductOptions={editorData.selectedRelatedProductOptions}
        selectedStoryProductOption={editorData.selectedStoryProductOption}
        action={saveAdminProductAction}
        deleteAction={deleteAdminProductAction}
        isNew={false}
        errorCode={error}
      />
    </Stack>
  );
};

export default EditAdminProductPage;