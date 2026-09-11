export enum AdminEntertainmentFormMode {
  New = "new",
  Edit = "edit",
}

export enum AdminEntertainmentFormErrorCode {
  TitleRequired = "title-required",
  VideoRequired = "video-required",
  FileRequired = "file-required",
  StorageUnavailable = "storage-unavailable",
  SaveFailed = "save-failed",
  DeleteFailed = "delete-failed",
  Unexpected = "unexpected",
}

export class AdminEntertainmentFormValidationError extends Error {
  constructor(readonly code: AdminEntertainmentFormErrorCode) {
    super(code);
    this.name = "AdminEntertainmentFormValidationError";
  }
}
