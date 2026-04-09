import GoogleIcon from "@mui/icons-material/Google";
import { Button, Stack } from "@mui/material";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { AuthGoogleSignInProps } from "./types";

export const AuthGoogleSignIn = ({
  dictionary,
  isGoogleEnabled,
  registerHref,
  onGoogleSignIn,
}: AuthGoogleSignInProps) => (
  <AuthSectionCard>
    <Stack spacing={2.5}>
      <AuthSectionHeader
        title={dictionary.googleTitle}
        description={isGoogleEnabled ? dictionary.ready : dictionary.unavailable}
        icon={<GoogleIcon />}
        iconBackground="#FCE5EA"
      />

      <Button
        variant="contained"
        size="large"
        startIcon={<GoogleIcon />}
        onClick={() => {
          void onGoogleSignIn();
        }}
        disabled={!isGoogleEnabled}
        sx={{ alignSelf: "flex-start" }}
      >
        {dictionary.googleButton}
      </Button>

      <AuthLinkPrompt
        href={registerHref}
        label={dictionary.registerLinkLabel}
        prefix={dictionary.registerPrompt}
      />
    </Stack>
  </AuthSectionCard>
);

export type { AuthGoogleSignInProps } from "./types";