import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

import type { ProfileEditorState } from "@/hooks/useProfileEditor.types";

export type SettingsSectionProps = {
  locale: Locale;
  country: CountryCode;
  availableLocales: string[];
  profileEditor: ProfileEditorState;
};
