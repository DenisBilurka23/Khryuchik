import type { SyntheticEvent } from "react";

import type { Locale } from "@/i18n/config";

export type AccountPasswordFormState = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
  isSaving: boolean;
  isSendingReset: boolean;
  resetSent: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setRepeatPassword: (value: string) => void;
  requestReset: () => Promise<void>;
  submit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};

export type AccountDeletionState = {
  password: string;
  errorMessage: string | null;
  setPassword: (value: string) => void;
  confirm: () => Promise<boolean | void>;
};

export type AccountNewsletterState = {
  isSubscribed: boolean | null;
  isToggling: boolean;
  errorMessage: string | null;
  toggle: (nextSubscribed: boolean) => Promise<void>;
};

export type UseAccountSettingsFormParams = {
  locale: Locale;
  userEmail: string;
  onAccountDeletedAction: () => void;
};

export type UseAccountSettingsFormResult = {
  password: AccountPasswordFormState;
  deletion: AccountDeletionState;
  newsletter: AccountNewsletterState;
};
