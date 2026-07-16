"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import { parseAdminHeroContentFormData } from "@/server/admin/form-data";
import { saveAdminHeroContent } from "@/server/home-content/home-content.service";

import { requireAdmin } from "./shared";

const revalidateHomeContentDependentPaths = () => {
  revalidatePath("/admin/home");
  revalidatePath("/");

  for (const locale of locales) {
    if (locale === "en") {
      continue;
    }

    revalidatePath(`/${locale}`);
  }
};

export const saveAdminHeroContentAction = async (formData: FormData) => {
  await requireAdmin();

  try {
    await saveAdminHeroContent(parseAdminHeroContentFormData(formData));
  } catch (error) {
    console.error("Admin home content action failed", error);
    redirect("/admin/home?error=1");
  }

  revalidateHomeContentDependentPaths();
  redirect("/admin/home?saved=1");
};
