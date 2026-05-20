"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { locales } from "@/i18n/config";
import {
  AdminCategoryDeleteError,
  adminCategoryDeleteErrorCodes,
  deleteAdminCategory,
  deleteAdminCustomer,
  deleteAdminProduct,
  saveAdminCategory,
  saveAdminCustomer,
  saveAdminProduct,
} from "@/server/admin/catalog.service";
import { AdminCustomerFormErrorCode } from "@/server/admin/customer-form-state";
import {
  parseAdminCategoryFormData,
  parseAdminProductFormData,
} from "@/server/admin/form-data";
import {
  AdminProductFormErrorCode,
  AdminProductFormMode,
} from "@/server/admin/product-form-state";
import { populateAdminProductIdentifiers } from "@/server/admin/product-identifiers";
import { requireAdminApiAccess } from "@/server/admin/auth";
import {
  deleteUserAvatarObject,
  uploadUserAvatarFile,
} from "@/server/storage/r2-assets.service";
import { isR2Configured } from "@/server/storage/r2";
import { UserOperationErrorReason } from "@/types/users";

const isUploadedFile = (
  entry: FormDataEntryValue | null | undefined,
): entry is File =>
  typeof entry === "object" &&
  entry !== null &&
  "size" in entry &&
  typeof entry.size === "number" &&
  entry.size > 0 &&
  "arrayBuffer" in entry &&
  typeof entry.arrayBuffer === "function";

const requireAdmin = async () => {
  const session = await requireAdminApiAccess();

  if (!session) {
    redirect("/login?callbackUrl=%2Fadmin");
  }

  return session;
};

const getAdminProductErrorRedirectPath = (
  formData: FormData,
  errorCode: AdminProductFormErrorCode,
) => {
  const rawFormMode = formData.get("formMode");
  const formMode =
    rawFormMode === AdminProductFormMode.Edit
      ? AdminProductFormMode.Edit
      : AdminProductFormMode.New;
  const rawProductId = formData.get("productId");
  const productId = typeof rawProductId === "string" ? rawProductId.trim() : "";

  if (formMode === AdminProductFormMode.Edit && productId) {
    return `/admin/products/${productId}/edit?error=${errorCode}`;
  }

  return `/admin/products/new?error=${errorCode}`;
};

const getAdminCustomerErrorRedirectPath = (
  formData: FormData,
  errorCode: AdminCustomerFormErrorCode,
) => {
  const rawUserId = formData.get("userId");
  const userId = typeof rawUserId === "string" ? rawUserId.trim() : "";
  const rawSource = formData.get("source");
  const source = rawSource === "edit" ? "edit" : "list";

  if (source === "edit" && userId) {
    return `/admin/customers/${userId}/edit?error=${errorCode}`;
  }

  return `/admin/customers?error=${errorCode}`;
};

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

const revalidateProductDependentPaths = (productSlug?: string) => {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/favorites");

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }

  for (const locale of locales) {
    if (locale === "en") {
      continue;
    }

    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/shop`);
    revalidatePath(`/${locale}/favorites`);

    if (productSlug) {
      revalidatePath(`/${locale}/products/${productSlug}`);
    }
  }
};

const revalidateCustomerDependentPaths = () => {
  revalidatePath("/admin");
  revalidatePath("/admin/customers");
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

export const saveAdminProductAction = async (formData: FormData) => {
  await requireAdmin();

  let payload: ReturnType<typeof parseAdminProductFormData> | undefined;
  let errorCode: AdminProductFormErrorCode | undefined;
  let redirectPath: string | undefined;

  try {
    payload = parseAdminProductFormData(formData);
    payload = await populateAdminProductIdentifiers(payload);

    await saveAdminProduct(payload);

    revalidateProductDependentPaths(payload.product.slug);
    redirectPath = `/admin/products/${payload.product.productId}/edit?saved=1`;
  } catch (error) {
    console.error("Admin product save failed", error);
    errorCode = AdminProductFormErrorCode.SaveFailed;
  }

  redirect(
    redirectPath ??
      getAdminProductErrorRedirectPath(
        formData,
        errorCode ?? AdminProductFormErrorCode.Unexpected,
      ),
  );
};

export const deleteAdminProductAction = async (formData: FormData) => {
  await requireAdmin();

  const rawProductId = formData.get("productId");
  const productId = typeof rawProductId === "string" ? rawProductId.trim() : "";
  let deletedProductSlug: string | undefined;

  try {
    const deletedProduct = await deleteAdminProduct(productId);
    deletedProductSlug = deletedProduct.slug;
  } catch (error) {
    console.error("Admin product delete failed", error);
    redirect(
      getAdminProductErrorRedirectPath(
        formData,
        AdminProductFormErrorCode.DeleteFailed,
      ),
    );
  }

  revalidateProductDependentPaths(deletedProductSlug);
  redirect("/admin/products?deleted=1");
};

export const saveAdminCustomerAction = async (formData: FormData) => {
  const session = await requireAdmin();

  const rawUserId = formData.get("userId");
  const userId = typeof rawUserId === "string" ? rawUserId.trim() : "";
  const rawEmail = formData.get("email");
  const rawName = formData.get("name");
  const rawPhone = formData.get("phone");
  const rawIsAdmin = formData.get("isAdmin");
  const rawRemoveAvatar = formData.get("removeAvatar");
  const rawAvatar = formData.get("avatar");
  const avatarFile = isUploadedFile(rawAvatar) ? rawAvatar : null;
  const removeAvatar = rawRemoveAvatar === "1" || rawRemoveAvatar === "true";
  let uploadedAvatar:
    | Awaited<ReturnType<typeof uploadUserAvatarFile>>
    | undefined;

  const cleanupUploadedAvatar = async () => {
    if (!uploadedAvatar?.objectKey) {
      return;
    }

    await deleteUserAvatarObject(uploadedAvatar.objectKey).catch(
      (cleanupError) => {
        console.error("Admin customer avatar cleanup failed", cleanupError);
      },
    );
  };

  if (avatarFile && !isR2Configured) {
    return redirect(
      getAdminCustomerErrorRedirectPath(
        formData,
        AdminCustomerFormErrorCode.StorageUnavailable,
      ),
    );
  }

  let result: Awaited<ReturnType<typeof saveAdminCustomer>> | undefined;

  try {
    if (avatarFile) {
      uploadedAvatar = await uploadUserAvatarFile({ userId, file: avatarFile });
    }

    if (avatarFile && !uploadedAvatar?.url) {
      await cleanupUploadedAvatar();
      return redirect(
        getAdminCustomerErrorRedirectPath(
          formData,
          AdminCustomerFormErrorCode.SaveFailed,
        ),
      );
    }

    result = await saveAdminCustomer(session.user.id, userId, {
      email: typeof rawEmail === "string" ? rawEmail.trim() : "",
      name: typeof rawName === "string" ? rawName.trim() : "",
      phone: typeof rawPhone === "string" ? rawPhone.trim() : "",
      isAdmin: rawIsAdmin === "on" || rawIsAdmin === "true",
      ...(uploadedAvatar
        ? {
            image: uploadedAvatar.url,
            avatarObjectKey: uploadedAvatar.objectKey,
          }
        : removeAvatar
          ? {
              image: null,
              avatarObjectKey: null,
            }
          : {}),
    });
  } catch (error) {
    console.error("Admin customer save failed", error);

    await cleanupUploadedAvatar();

    return redirect(
      getAdminCustomerErrorRedirectPath(
        formData,
        AdminCustomerFormErrorCode.SaveFailed,
      ),
    );
  }

  if (!result?.ok) {
    await cleanupUploadedAvatar();

    switch (result.reason) {
      case UserOperationErrorReason.NotFound:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.NotFound,
          ),
        );
      case UserOperationErrorReason.EmailTaken:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.EmailTaken,
          ),
        );
      case UserOperationErrorReason.EmailManagedByGoogle:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.EmailManagedByGoogle,
          ),
        );
      case UserOperationErrorReason.CannotDemoteSelf:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.CannotDemoteSelf,
          ),
        );
      case UserOperationErrorReason.LastAdmin:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.LastAdmin,
          ),
        );
      default:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.Unexpected,
          ),
        );
    }
  }

  if (
    result.previousAvatarObjectKey &&
    result.previousAvatarObjectKey !== result.nextAvatarObjectKey
  ) {
    await deleteUserAvatarObject(result.previousAvatarObjectKey).catch(
      (cleanupError) => {
        console.error(
          "Admin customer previous avatar cleanup failed",
          cleanupError,
        );
      },
    );
  }

  revalidateCustomerDependentPaths();
  return redirect(`/admin/customers/${userId}/edit?saved=1`);
};

export const deleteAdminCustomerAction = async (formData: FormData) => {
  const session = await requireAdmin();

  const rawUserId = formData.get("userId");
  const userId = typeof rawUserId === "string" ? rawUserId.trim() : "";
  let result: Awaited<ReturnType<typeof deleteAdminCustomer>> | undefined;

  try {
    result = await deleteAdminCustomer(session.user.id, userId);
  } catch (error) {
    console.error("Admin customer delete failed", error);
    redirect(
      getAdminCustomerErrorRedirectPath(
        formData,
        AdminCustomerFormErrorCode.DeleteFailed,
      ),
    );
  }

  if (!result?.ok) {
    switch (result.reason) {
      case UserOperationErrorReason.NotFound:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.NotFound,
          ),
        );
      case UserOperationErrorReason.CannotDeleteSelf:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.CannotDeleteSelf,
          ),
        );
      case UserOperationErrorReason.LastAdmin:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.LastAdmin,
          ),
        );
      default:
        return redirect(
          getAdminCustomerErrorRedirectPath(
            formData,
            AdminCustomerFormErrorCode.Unexpected,
          ),
        );
    }
  }

  if (result.avatarObjectKey) {
    await deleteUserAvatarObject(result.avatarObjectKey).catch(
      (cleanupError) => {
        console.error(
          "Admin customer avatar delete cleanup failed",
          cleanupError,
        );
      },
    );
  }

  revalidateCustomerDependentPaths();
  return redirect("/admin/customers?deleted=1");
};
