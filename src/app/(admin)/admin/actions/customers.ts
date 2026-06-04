"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteAdminCustomer,
  saveAdminCustomer,
} from "@/server/admin/catalog.service";
import { AdminCustomerFormErrorCode } from "@/server/admin/customer-form-state";
import {
  deleteUserAvatarObject,
  uploadUserAvatarFile,
} from "@/server/storage/r2-assets.service";
import { isR2Configured } from "@/server/storage/r2";
import { UserOperationErrorReason } from "@/types/users";

import { requireAdmin } from "./shared";

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

const revalidateCustomerDependentPaths = () => {
  revalidatePath("/admin");
  revalidatePath("/admin/customers");
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
