import type { SyntheticEvent } from "react";

export type AuthCredentialsFormProps = {
  email: string;
  password: string;
  errorMessage: string | null;
  isLoading: boolean;
  forgotPasswordHref: string;
  canResendVerification: boolean;
  isResendingVerification: boolean;
  resendVerificationMessage: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onResendVerification: () => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};
