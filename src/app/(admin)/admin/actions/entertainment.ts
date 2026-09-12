"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import {
  AdminEntertainmentFormErrorCode,
  AdminEntertainmentFormMode,
  AdminEntertainmentFormValidationError,
} from "@/server/admin/entertainment-form-state";
import {
  deleteAdminEntertainmentItem,
  saveAdminEntertainmentItem,
} from "@/server/admin/entertainment.service";
import { parseAdminEntertainmentFormData } from "@/server/admin/form-data";
import { requeueEntertainmentTranscode } from "@/server/entertainment/services/entertainment-transcode.service";
import { dispatchEntertainmentTranscode } from "@/server/entertainment/transcode-dispatch.client";

import { requireAdmin } from "./shared";

const getAdminEntertainmentErrorRedirectPath = (
  formData: FormData,
  errorCode: AdminEntertainmentFormErrorCode,
) => {
  const rawFormMode = formData.get("formMode");
  const formMode =
    rawFormMode === AdminEntertainmentFormMode.Edit
      ? AdminEntertainmentFormMode.Edit
      : AdminEntertainmentFormMode.New;
  const rawCurrentSlug = formData.get("currentSlug");
  const currentSlug =
    typeof rawCurrentSlug === "string" ? rawCurrentSlug.trim() : "";

  if (formMode === AdminEntertainmentFormMode.Edit && currentSlug) {
    return `/admin/entertainment/${currentSlug}/edit?error=${errorCode}`;
  }

  return `/admin/entertainment/new?error=${errorCode}`;
};

const revalidateEntertainmentDependentPaths = (slugs: string[]) => {
  revalidatePath("/admin");
  revalidatePath("/admin/entertainment");
  revalidatePath("/");
  revalidatePath("/entertainment");

  for (const slug of slugs) {
    revalidatePath(`/entertainment/${slug}`);
  }

  for (const locale of locales) {
    if (locale === "en") {
      continue;
    }

    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/entertainment`);

    for (const slug of slugs) {
      revalidatePath(`/${locale}/entertainment/${slug}`);
    }
  }
};

export const saveAdminEntertainmentItemAction = async (formData: FormData) => {
  await requireAdmin();

  let redirectPath: string | undefined;
  let errorCode: AdminEntertainmentFormErrorCode | undefined;
  let touchedSlugs: string[] = [];

  try {
    const input = parseAdminEntertainmentFormData(formData);
    const saved = await saveAdminEntertainmentItem(input);

    touchedSlugs = [
      saved.slug,
      ...(input.currentSlug && input.currentSlug !== saved.slug
        ? [input.currentSlug]
        : []),
    ];

    if (saved.media.type === "video" && saved.media.status === "processing") {
      await dispatchEntertainmentTranscode(saved.slug);
    }

    redirectPath = `/admin/entertainment/${saved.slug}/edit?saved=1`;
  } catch (error) {
    if (error instanceof AdminEntertainmentFormValidationError) {
      errorCode = error.code;
    } else {
      console.error("Admin entertainment save failed", error);
      errorCode = AdminEntertainmentFormErrorCode.SaveFailed;
    }
  }

  if (touchedSlugs.length > 0) {
    revalidateEntertainmentDependentPaths(touchedSlugs);
  }

  redirect(
    redirectPath ??
      getAdminEntertainmentErrorRedirectPath(
        formData,
        errorCode ?? AdminEntertainmentFormErrorCode.Unexpected,
      ),
  );
};

export const deleteAdminEntertainmentItemAction = async (
  formData: FormData,
) => {
  await requireAdmin();

  const rawSlug = formData.get("slug");
  const slug = typeof rawSlug === "string" ? rawSlug.trim() : "";

  try {
    await deleteAdminEntertainmentItem(slug);
  } catch (error) {
    console.error("Admin entertainment delete failed", error);
    redirect(
      `/admin/entertainment?error=${AdminEntertainmentFormErrorCode.DeleteFailed}`,
    );
  }

  revalidateEntertainmentDependentPaths([slug]);
  redirect("/admin/entertainment?deleted=1");
};

export const requeueAdminEntertainmentItemAction = async (
  formData: FormData,
) => {
  await requireAdmin();

  const rawSlug = formData.get("slug");
  const slug = typeof rawSlug === "string" ? rawSlug.trim() : "";
  let requeued = false;

  try {
    requeued = await requeueEntertainmentTranscode(slug);
  } catch (error) {
    console.error("Admin entertainment requeue failed", error);
  }

  if (!requeued) {
    redirect(
      `/admin/entertainment?error=${AdminEntertainmentFormErrorCode.RequeueFailed}`,
    );
  }

  revalidateEntertainmentDependentPaths([slug]);
  redirect("/admin/entertainment?requeued=1");
};
