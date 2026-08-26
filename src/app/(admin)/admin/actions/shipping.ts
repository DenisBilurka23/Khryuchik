"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseAdminShippingSettingsFormData } from "@/server/admin/form-data";
import { saveShippingSettings } from "@/server/shipping/services/shipping-settings.service";

import { requireAdmin } from "./shared";

export const saveAdminShippingSettingsAction = async (formData: FormData) => {
  await requireAdmin();

  try {
    await saveShippingSettings(parseAdminShippingSettingsFormData(formData));
  } catch (error) {
    console.error("Admin shipping settings action failed", error);
    redirect("/admin/shipping?error=1");
  }

  revalidatePath("/admin/shipping");
  redirect("/admin/shipping?saved=1");
};
