"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import {
  AdminCategoryDeleteError,
  adminCategoryDeleteErrorCodes,
  deleteAdminCategory,
  saveAdminCategory,
} from "@/server/admin/catalog.service";
import { parseAdminCategoryFormData } from "@/server/admin/form-data";

import { requireAdmin } from "./shared";

const revalidateCategoryDependentPaths = () => {
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/favorites");

  for (const locale of locales) {
    if (locale === "en") {
      continue;
    }

    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/shop`);
    revalidatePath(`/${locale}/favorites`);
  }
};

export const saveAdminCategoryAction = async (formData: FormData) => {
  await requireAdmin();

  const input = parseAdminCategoryFormData(formData);

  await saveAdminCategory(input);

  revalidateCategoryDependentPaths();
  redirect("/admin/categories?saved=1");
};

export const deleteAdminCategoryAction = async (formData: FormData) => {
  await requireAdmin();

  const key = formData.get("key");
  const normalizedKey = typeof key === "string" ? key.trim() : "";

  try {
    await deleteAdminCategory(normalizedKey);
  } catch (error) {
    if (error instanceof AdminCategoryDeleteError) {
      redirect(`/admin/categories?error=${error.code}`);
    }

    console.error("Admin category delete failed", error);
    redirect(
      `/admin/categories?error=${adminCategoryDeleteErrorCodes.InvalidKey}`,
    );
  }

  revalidateCategoryDependentPaths();
  redirect("/admin/categories?deleted=1");
};
