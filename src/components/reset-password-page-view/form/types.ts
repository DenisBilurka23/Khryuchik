import type { SyntheticEvent } from "react";

export type ResetPasswordFormProps = {
  password: string;
  confirmPassword: string;
  errorMessage: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
  loginHref: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};