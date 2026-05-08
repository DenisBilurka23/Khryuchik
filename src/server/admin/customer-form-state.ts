import type { AdminPageDictionary } from "@/i18n/types";

export enum AdminCustomerFormErrorCode {
  NotFound = "not-found",
  StorageUnavailable = "storage-unavailable",
  EmailTaken = "email-taken",
  EmailManagedByGoogle = "email-managed-by-google",
  CannotDeleteSelf = "cannot-delete-self",
  CannotDemoteSelf = "cannot-demote-self",
  LastAdmin = "last-admin",
  SaveFailed = "save-failed",
  DeleteFailed = "delete-failed",
  Unexpected = "unexpected",
}

export const getAdminCustomerFormErrorMessage = (
  error: string | undefined,
  dictionary: AdminPageDictionary["customers"]["form"],
) => {
  switch (error) {
    case AdminCustomerFormErrorCode.NotFound:
      return dictionary.errorMessages.notFound;
    case AdminCustomerFormErrorCode.StorageUnavailable:
      return dictionary.errorMessages.storageUnavailable;
    case AdminCustomerFormErrorCode.EmailTaken:
      return dictionary.errorMessages.emailTaken;
    case AdminCustomerFormErrorCode.EmailManagedByGoogle:
      return dictionary.errorMessages.emailManagedByGoogle;
    case AdminCustomerFormErrorCode.CannotDeleteSelf:
      return dictionary.errorMessages.cannotDeleteSelf;
    case AdminCustomerFormErrorCode.CannotDemoteSelf:
      return dictionary.errorMessages.cannotDemoteSelf;
    case AdminCustomerFormErrorCode.LastAdmin:
      return dictionary.errorMessages.lastAdmin;
    case AdminCustomerFormErrorCode.SaveFailed:
      return dictionary.errorMessages.saveFailed;
    case AdminCustomerFormErrorCode.DeleteFailed:
      return dictionary.errorMessages.deleteFailed;
    case AdminCustomerFormErrorCode.Unexpected:
      return dictionary.errorMessages.unexpected;
    default:
      return undefined;
  }
};