import type { SyntheticEvent } from "react";

import type { RegisterPageDictionary } from "@/i18n/types";

export type RegisterFormProps = {
  dictionary: RegisterPageDictionary;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  errorMessage: string | null;
  isSubmitting: boolean;
  loginHref: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};