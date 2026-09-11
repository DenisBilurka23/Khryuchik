import type { Locale } from "@/i18n/config";
import type { EntertainmentItemDocument } from "@/types/entertainment";
import type { LocaleDocument } from "@/types/localization";

export type AdminEntertainmentFormProps = {
  locale: Locale;
  item: EntertainmentItemDocument;
  activeLocales: LocaleDocument[];
  action: (formData: FormData) => Promise<void>;
  isNew: boolean;
  errorCode?: string;
};

export type AdminEntertainmentPendingChangeHandler = (
  key: string,
  isPending: boolean,
) => void;
