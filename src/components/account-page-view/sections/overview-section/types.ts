import type { SyntheticEvent } from "react";

import type {
  AccountAddressMock,
  AccountDownloadMock,
  AccountOrderMock,
} from "@/data/account-page-mock";
import type { Locale } from "@/i18n/config";

export type OverviewSectionProps = {
  locale: Locale;
  orders: AccountOrderMock[];
  downloads: AccountDownloadMock[];
  addresses: AccountAddressMock[];
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
  onSave: (event?: SyntheticEvent) => Promise<void>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};