import type { SyntheticEvent } from "react";

export type ForgotPasswordFormProps = {
  email: string;
  errorMessage: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
};
