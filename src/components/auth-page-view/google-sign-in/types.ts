import type { AuthPageDictionary } from "@/i18n/types";

export type AuthGoogleSignInProps = {
  dictionary: AuthPageDictionary;
  isGoogleEnabled: boolean;
  registerHref: string;
  onGoogleSignIn: () => Promise<void>;
};