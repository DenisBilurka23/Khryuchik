type AdminCustomerFormErrorMessages = {
  notFound: string;
  storageUnavailable: string;
  emailTaken: string;
  emailManagedByGoogle: string;
  cannotDeleteSelf: string;
  cannotDemoteSelf: string;
  lastAdmin: string;
  saveFailed: string;
  deleteFailed: string;
  unexpected: string;
};

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
  messages: AdminCustomerFormErrorMessages,
) => {
  switch (error) {
    case AdminCustomerFormErrorCode.NotFound:
      return messages.notFound;
    case AdminCustomerFormErrorCode.StorageUnavailable:
      return messages.storageUnavailable;
    case AdminCustomerFormErrorCode.EmailTaken:
      return messages.emailTaken;
    case AdminCustomerFormErrorCode.EmailManagedByGoogle:
      return messages.emailManagedByGoogle;
    case AdminCustomerFormErrorCode.CannotDeleteSelf:
      return messages.cannotDeleteSelf;
    case AdminCustomerFormErrorCode.CannotDemoteSelf:
      return messages.cannotDemoteSelf;
    case AdminCustomerFormErrorCode.LastAdmin:
      return messages.lastAdmin;
    case AdminCustomerFormErrorCode.SaveFailed:
      return messages.saveFailed;
    case AdminCustomerFormErrorCode.DeleteFailed:
      return messages.deleteFailed;
    case AdminCustomerFormErrorCode.Unexpected:
      return messages.unexpected;
    default:
      return undefined;
  }
};