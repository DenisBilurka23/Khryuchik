export enum AdminProductFormMode {
  New = "new",
  Edit = "edit",
}

export enum AdminProductFormErrorCode {
  StorageUnavailable = "storage-unavailable",
  SaveFailed = "save-failed",
  DeleteFailed = "delete-failed",
  LanguagesRequired = "languages-required",
  Unexpected = "unexpected",
}

export class AdminProductFormValidationError extends Error {
  constructor(readonly code: AdminProductFormErrorCode) {
    super(code);
    this.name = "AdminProductFormValidationError";
  }
}
