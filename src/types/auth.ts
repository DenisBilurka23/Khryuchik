export enum AuthInputErrorCode {
  MissingFields = "missing_fields",
  InvalidEmail = "invalid_email",
  PasswordTooShort = "password_too_short",
  UnexpectedError = "unexpected_error",
}

export enum PasswordResetErrorReason {
  InvalidToken = "invalid_token",
}

export enum EmailVerificationErrorReason {
  InvalidToken = "invalid_token",
}

export enum SignInErrorCode {
  InvalidCredentials = "invalid_credentials",
  EmailNotVerified = "email_not_verified",
}
