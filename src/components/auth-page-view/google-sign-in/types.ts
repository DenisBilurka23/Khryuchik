export type AuthGoogleSignInProps = {
  isGoogleEnabled: boolean;
  registerHref: string;
  onGoogleSignIn: () => Promise<void>;
};