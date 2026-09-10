import type { AuthCredentialsFormProps } from "../credentials-form";
import type { AuthGoogleSignInProps } from "../google-sign-in";

export type AuthSignInCardProps = AuthCredentialsFormProps &
  AuthGoogleSignInProps;
