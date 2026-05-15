import GoogleIcon from "@mui/icons-material/Google";
import { Button, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AuthLinkPrompt,
  AuthSectionCard,
  AuthSectionHeader,
} from "@/components/auth-page-shared";

import type { AuthGoogleSignInProps } from "./types";

export const AuthGoogleSignIn = ({
  isGoogleEnabled,
  registerHref,
  onGoogleSignIn,
}: AuthGoogleSignInProps) => {
  const t = useTranslations("authPage");

  return (
    <AuthSectionCard>
      <Stack spacing={2.5}>
        <AuthSectionHeader
          title={t("googleTitle")}
          description={isGoogleEnabled ? t("ready") : t("unavailable")}
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
          {t("googleButton")}
        </Button>

        <AuthLinkPrompt
          href={registerHref}
          label={t("registerLinkLabel")}
          prefix={t("registerPrompt")}
        />
      </Stack>
    </AuthSectionCard>
  );
};

export type { AuthGoogleSignInProps } from "./types";