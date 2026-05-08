import type { AdminPageDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { AdminCustomerEditorData } from "@/types/admin";

export type AdminCustomerFormProps = {
  customer: AdminCustomerEditorData;
  locale: Locale;
  dictionary: AdminPageDictionary["customers"]["form"];
  sharedDictionary: AdminPageDictionary["shared"];
  action: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  errorMessage?: string;
  isCurrentUser?: boolean;
};