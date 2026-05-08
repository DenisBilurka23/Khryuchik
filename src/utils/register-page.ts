import { AuthInputErrorCode } from "@/types/auth";
import type { RegisterPageDictionary } from "@/i18n/types";
import { UserOperationErrorReason } from "@/types/users";

export const getRegisterErrorMessage = (
  errorCode: string,
  dictionary: RegisterPageDictionary,
) => {
  switch (errorCode) {
    case UserOperationErrorReason.EmailTaken:
      return dictionary.emailTaken;
    case AuthInputErrorCode.PasswordTooShort:
      return dictionary.passwordTooShort;
    case AuthInputErrorCode.InvalidEmail:
      return dictionary.invalidEmail;
    case AuthInputErrorCode.MissingFields:
      return dictionary.missingFields;
    default:
      return dictionary.unexpectedError;
  }
};