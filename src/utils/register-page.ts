import type { RegisterPageDictionary } from "@/i18n/types";

export const getRegisterErrorMessage = (
  errorCode: string,
  dictionary: RegisterPageDictionary,
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