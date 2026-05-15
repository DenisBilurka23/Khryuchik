import type { SyntheticEvent } from "react";

export type AuthCredentialsFormProps = {
  email: string;
  password: string;
  errorMessage: string | null;
  isLoading: boolean;
  forgotPasswordHref: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};