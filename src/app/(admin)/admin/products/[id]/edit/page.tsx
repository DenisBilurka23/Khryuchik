import type { Metadata } from "next";
import { Alert, Stack } from "@mui/material";

import { AdminProductForm } from "@/components/admin-product-form";
import { getAdminProductEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { getAdminProductFormErrorMessage } from "@/server/admin/product-form-state";

import { saveAdminProductAction } from "../../../actions";

type EditAdminProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export const generateMetadata = async ({
  params,
}: EditAdminProductPageProps): Promise<Metadata> => {
  const [{ dictionary }, { id }] = await Promise.all([
    getAdminPageContext(),
    params,
  ]);

  return createAdminMetadata(
    `${dictionary.productForm.editTitlePrefix}: ${id}`,
    dictionary.productForm.editDescription,
  );
};

const EditAdminProductPage = async ({
  params,
  searchParams,
}: EditAdminProductPageProps) => {
  const { id } = await params;
  const { saved, error } = await searchParams;
  const [{ dictionary, locale }, editorData] = await Promise.all([
    getAdminPageContext(),
    getAdminProductEditorData(id),
  ]);

  return (
    <Stack gap={2}>
      {saved === "1" ? <Alert severity="success">{dictionary.productForm.savedMessage}</Alert> : null}
      <AdminProductForm
        title={`${dictionary.productForm.editTitlePrefix}: ${editorData.payload.product.productId}`}
        description={dictionary.productForm.editDescription}
        submitLabel={dictionary.productForm.saveChangesButton}
        locale={locale}
        dictionary={dictionary.productForm}
        sharedDictionary={dictionary.shared}
        payload={editorData.payload}
        categories={editorData.categories}
        action={saveAdminProductAction}
        isNew={false}
        errorMessage={getAdminProductFormErrorMessage(error, dictionary.productForm)}
      />
    </Stack>
  );
};

export default EditAdminProductPage;