import type { SyntheticEvent } from "react";

import type { AuthPageDictionary } from "@/i18n/types";

export type AuthCredentialsFormProps = {
  dictionary: AuthPageDictionary;
  email: string;
  password: string;
  errorMessage: string | null;
  isLoading: boolean;
  forgotPasswordHref: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};