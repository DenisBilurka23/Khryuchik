export type EmailVerificationResendStatus =
  | "idle"
  | "sending"
  | "sent"
  | "error";

export type UseEmailVerificationResendResult = {
  status: EmailVerificationResendStatus;
  resend: (email: string) => Promise<void>;
  reset: () => void;
};
