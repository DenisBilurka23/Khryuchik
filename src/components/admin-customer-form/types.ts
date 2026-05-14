import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { AdminCustomerEditorData } from "@/types/admin";

export type AdminCustomerFormProps = {
  customer: AdminCustomerEditorData;
  locale: Locale;
  dictionary: Dictionary["adminPage"]["customers"]["form"];
  sharedDictionary: Dictionary["adminPage"]["shared"];
  action: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  errorCode?: string;
  isCurrentUser?: boolean;
};