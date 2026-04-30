import type { AdminPageDictionary } from "@/i18n/types";

export enum AdminProductFormMode {
  New = "new",
  Edit = "edit",
}

export enum AdminProductFormErrorCode {
  StorageUnavailable = "storage-unavailable",
  SaveFailed = "save-failed",
  DeleteFailed = "delete-failed",
  Unexpected = "unexpected",
}

export const getAdminProductFormErrorMessage = (
  error: string | undefined,
  dictionary: AdminPageDictionary["productForm"],
) => {
  switch (error) {
    case AdminProductFormErrorCode.StorageUnavailable:
      return dictionary.errorMessages.storageUnavailable;
    case AdminProductFormErrorCode.SaveFailed:
      return dictionary.errorMessages.saveFailed;
    case AdminProductFormErrorCode.DeleteFailed:
      return dictionary.errorMessages.deleteFailed;
    case AdminProductFormErrorCode.Unexpected:
      return dictionary.errorMessages.unexpected;
    default:
      return undefined;
  }
};