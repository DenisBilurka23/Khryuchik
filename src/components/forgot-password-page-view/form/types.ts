import type { SyntheticEvent } from "react";

import type { ForgotPasswordPageDictionary } from "@/i18n/types";

export type ForgotPasswordFormProps = {
  dictionary: ForgotPasswordPageDictionary;
  email: string;
  errorMessage: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
  loginHref: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};