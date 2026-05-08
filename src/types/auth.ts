export enum AuthInputErrorCode {
  MissingFields = "missing_fields",
  InvalidEmail = "invalid_email",
  PasswordTooShort = "password_too_short",
  UnexpectedError = "unexpected_error",
}

export enum PasswordResetErrorReason {
  InvalidToken = "invalid_token",
}