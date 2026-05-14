import type { Locale } from "@/i18n/config";
import type { AdminCustomerEditorData } from "@/types/admin";

export type AdminCustomerFormProps = {
  customer: AdminCustomerEditorData;
  locale: Locale;
  action: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  errorCode?: string;
  isCurrentUser?: boolean;
};