import type { RegisterPageViewProps } from "./types";

export const getRegisterErrorMessage = (
  errorCode: string,
  dictionary: RegisterPageViewProps["dictionary"],
) => {
  switch (errorCode) {
    case "email_taken":
      return dictionary.emailTaken;
    case "password_too_short":
      return dictionary.passwordTooShort;
    case "invalid_email":
      return dictionary.invalidEmail;
    case "missing_fields":
      return dictionary.missingFields;
    default:
      return dictionary.unexpectedError;
  }
};