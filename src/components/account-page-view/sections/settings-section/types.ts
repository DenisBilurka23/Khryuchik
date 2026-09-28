import type { Locale } from "@/i18n/config";
import type { AuthProvider } from "@/types/users";
import type { RegionCode } from "@/utils";

import type { ProfileEditorState } from "@/hooks/useProfileEditor.types";

export type SettingsSectionProps = {
  locale: Locale;
  region: RegionCode;
  availableLocales: string[];
  availableRegions: RegionCode[];
  profileEditor: ProfileEditorState;
  authProviders: AuthProvider[];
  userEmail: string;
  onAccountDeletedAction: () => void;
};
