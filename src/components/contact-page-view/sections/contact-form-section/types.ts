import type { Locale } from "@/i18n/config";
import type { ContactPageLabels } from "@/i18n/types";

export type ContactFormProps = {
  locale: Locale;
  contactEmail: string;
  defaultName: string;
  defaultEmail: string;
  labels: ContactPageLabels["form"];
};

export type ContactFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};
