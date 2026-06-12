"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import {
  LocalizationError,
  localizationErrorCodes,
  deleteAdminLocale,
  deleteAdminRegion,
  saveAdminLocale,
  saveAdminRegion,
} from "@/server/localization/localization.service";
import {
  parseAdminLocaleFormData,
  parseAdminRegionFormData,
} from "@/server/admin/form-data";

import { requireAdmin } from "./shared";

const revalidateLocalizationDependentPaths = () => {
  revalidatePath("/admin");
  revalidatePath("/admin/localization");
  revalidatePath("/admin/products", "layout");
  revalidatePath("/");
  revalidatePath("/shop");

  for (const locale of locales) {
    if (locale === "en") {
      continue;
    }

    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/shop`);
  }
};

const handleLocalizationError = (error: unknown) => {
  if (error instanceof LocalizationError) {
    redirect(`/admin/localization?error=${error.code}`);
  }

  console.error("Admin localization action failed", error);
  redirect(`/admin/localization?error=${localizationErrorCodes.InvalidCode}`);
};

export const saveAdminLocaleAction = async (formData: FormData) => {
  await requireAdmin();

  try {
    await saveAdminLocale(parseAdminLocaleFormData(formData));
  } catch (error) {
    handleLocalizationError(error);
  }

  revalidateLocalizationDependentPaths();
  redirect("/admin/localization?saved=1");
};

export const deleteAdminLocaleAction = async (formData: FormData) => {
  await requireAdmin();

  const code = formData.get("code");
  const normalizedCode = typeof code === "string" ? code : "";

  try {
    await deleteAdminLocale(normalizedCode);
  } catch (error) {
    handleLocalizationError(error);
  }

  revalidateLocalizationDependentPaths();
  redirect("/admin/localization?deleted=1");
};

export const saveAdminRegionAction = async (formData: FormData) => {
  await requireAdmin();

  try {
    await saveAdminRegion(parseAdminRegionFormData(formData));
  } catch (error) {
    handleLocalizationError(error);
  }

  revalidateLocalizationDependentPaths();
  redirect("/admin/localization?saved=1");
};

export const deleteAdminRegionAction = async (formData: FormData) => {
  await requireAdmin();

  const code = formData.get("code");
  const normalizedCode = typeof code === "string" ? code : "";

  try {
    await deleteAdminRegion(normalizedCode);
  } catch (error) {
    handleLocalizationError(error);
  }

  revalidateLocalizationDependentPaths();
  redirect("/admin/localization?deleted=1");
};
