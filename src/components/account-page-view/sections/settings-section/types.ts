import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

export type SettingsSectionProps = {
  locale: Locale;
  country: CountryCode;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isEditingProfile: boolean;
  isSavingProfile: boolean;
  isEmailEditable: boolean;
  profileError: string | null;
  profileSuccess: string | null;
  onBeginEdit: () => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};