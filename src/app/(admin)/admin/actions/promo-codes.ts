"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseAdminPromoCodeFormData } from "@/server/admin/form-data";
import {
  deleteAdminPromoCode,
  PromoCodeError,
  promoCodeErrorCodes,
  saveAdminPromoCode,
} from "@/server/promo/services/promo-codes.service";

import { requireAdmin } from "./shared";

export const saveAdminPromoCodeAction = async (formData: FormData) => {
  await requireAdmin();

  const input = parseAdminPromoCodeFormData(formData);

  try {
    await saveAdminPromoCode(input);
  } catch (error) {
    if (error instanceof PromoCodeError) {
      redirect(`/admin/promocodes?error=${error.code}`);
    }

    console.error("Admin promo code save failed", error);
    redirect(`/admin/promocodes?error=${promoCodeErrorCodes.InvalidCode}`);
  }

  revalidatePath("/admin/promocodes");
  redirect("/admin/promocodes?saved=1");
};

export const deleteAdminPromoCodeAction = async (formData: FormData) => {
  await requireAdmin();

  const code = formData.get("code");

  try {
    await deleteAdminPromoCode(typeof code === "string" ? code : "");
  } catch (error) {
    if (error instanceof PromoCodeError) {
      redirect(`/admin/promocodes?error=${error.code}`);
    }

    console.error("Admin promo code delete failed", error);
    redirect(`/admin/promocodes?error=${promoCodeErrorCodes.InvalidCode}`);
  }

  revalidatePath("/admin/promocodes");
  redirect("/admin/promocodes?deleted=1");
};
