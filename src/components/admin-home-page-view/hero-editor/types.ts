import type { Locale } from "@/i18n/config";
import type { AdminHeroContentData } from "@/types/admin";

export type AdminHeroEditorProps = {
  locale: Locale;
  data: AdminHeroContentData;
  saveAction: (formData: FormData) => Promise<void>;
};
