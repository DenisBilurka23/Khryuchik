import type { AccountPageDictionary } from "@/i18n/types";
import { UserOperationErrorReason } from "@/types/users";

import type { SectionKey } from "@/components/account-page-view/types";

export const tabSections: Array<Exclude<SectionKey, "favorites" | "logout">> = [
  "overview",
  "orders",
  "books",
  "addresses",
  "settings",
];

export const splitName = (value: string | null | undefined) => {
  const normalizedName = value?.trim() ?? "";

  if (!normalizedName) {
    return { firstName: "", lastName: "" };
  }

  const [firstName = "", ...lastNameParts] = normalizedName.split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};

export const getProfileErrorMessage = (
  errorCode: string,
  dictionary: AccountPageDictionary,
) => {
  switch (errorCode) {
    case "invalid_email":
      return dictionary.invalidEmail;
    case UserOperationErrorReason.EmailTaken:
      return dictionary.emailTaken;
    case "missing_fields":
      return dictionary.missingFields;
    case UserOperationErrorReason.EmailManagedByGoogle:
      return dictionary.emailManagedByGoogle;
    default:
      return dictionary.unexpectedError;
  }
};