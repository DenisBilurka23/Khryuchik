import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminProductForm } from "@/components/admin-product-form";
import { getAdminProductEditorData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";

import { saveAdminProductAction } from "../../actions";

type NewAdminProductPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tProductForm = await getTranslations({
    locale,
    namespace: "adminPage.productForm",
  });

  return createAdminMetadata(
    tProductForm("newTitle"),
    tProductForm("newDescription"),
    locale,
  );
};

const NewAdminProductPage = async ({ searchParams }: NewAdminProductPageProps) => {
  const { error } = await searchParams;
  const locale = await resolveLocale("admin");
  const editorData = await getAdminProductEditorData(undefined, locale);

  return (
    <AdminProductForm
      key={`new:${error ?? "ok"}`}
      locale={locale}
      payload={editorData.payload}
      categories={editorData.categories}
      activeLocales={editorData.activeLocales}
      activeRegions={editorData.activeRegions}
      initialRelatedProductOptions={editorData.initialRelatedProductOptions}
      selectedRelatedProductOptions={editorData.selectedRelatedProductOptions}
      selectedStoryProductOption={editorData.selectedStoryProductOption}
      action={saveAdminProductAction}
      isNew
      errorCode={error}
    />
  );
};

export default NewAdminProductPage;