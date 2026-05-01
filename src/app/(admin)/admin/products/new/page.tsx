import type { Metadata } from "next";
import { AdminProductForm } from "@/components/admin-product-form";
import { getAdminProductEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getAdminPageContext } from "@/server/admin/page-context";
import { getAdminProductFormErrorMessage } from "@/server/admin/product-form-state";

import { saveAdminProductAction } from "../../actions";

type NewAdminProductPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const { dictionary } = await getAdminPageContext();

  return createAdminMetadata(
    dictionary.productForm.newTitle,
    dictionary.productForm.newDescription,
  );
};

const NewAdminProductPage = async ({ searchParams }: NewAdminProductPageProps) => {
  const { error } = await searchParams;
  const { dictionary, locale } = await getAdminPageContext();
  const editorData = await getAdminProductEditorData(undefined, locale);

  return (
    <AdminProductForm
      key={`new:${error ?? "ok"}`}
      title={dictionary.productForm.newTitle}
      description={dictionary.productForm.newDescription}
      submitLabel={dictionary.productForm.createButton}
      pendingSubmitLabel={dictionary.productForm.creatingButton}
      locale={locale}
      dictionary={dictionary.productForm}
      sharedDictionary={dictionary.shared}
      payload={editorData.payload}
      categories={editorData.categories}
      initialRelatedProductOptions={editorData.initialRelatedProductOptions}
      selectedRelatedProductOptions={editorData.selectedRelatedProductOptions}
      selectedStoryProductOption={editorData.selectedStoryProductOption}
      action={saveAdminProductAction}
      isNew
      errorMessage={getAdminProductFormErrorMessage(error, dictionary.productForm)}
    />
  );
};

export default NewAdminProductPage;