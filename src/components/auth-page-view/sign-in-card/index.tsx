import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { AuthSectionDivider } from "@/components/auth-page-shared";
import { IconTile, Plate } from "@/components/primitives";

import { AuthCredentialsForm } from "../credentials-form";
import { AuthGoogleSignIn } from "../google-sign-in";

import type { AuthSignInCardProps } from "./types";

const cardSx = {
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-floating)",
  p: { xs: "26px 20px", md: "32px 34px" },
} as const;

const headerSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.75,
  mb: 3,
} as const;

const titleSx = {
  fontSize: { xs: 24, md: 28 },
  lineHeight: 1.2,
} as const;

const dividerSx = { my: 2.5 } as const;

export const AuthSignInCard = ({
  isGoogleEnabled,
  onGoogleSignIn,
  ...formProps
}: AuthSignInCardProps) => {
  const t = useTranslations("authPage");

  return (
    <Plate pad="none" sx={cardSx}>
      <Box sx={headerSx}>
        <IconTile tone="accent">
          <LockOutlinedIcon />
        </IconTile>

        <Typography variant="h3" sx={titleSx}>
          {t("credentialsTitle")}
        </Typography>
      </Box>

      <AuthCredentialsForm {...formProps} />

      <Box sx={dividerSx}>
        <AuthSectionDivider label={t("dividerLabel")} />
      </Box>

      <AuthGoogleSignIn
        isGoogleEnabled={isGoogleEnabled}
        onGoogleSignIn={onGoogleSignIn}
      />
    </Plate>
  );
};

export type { AuthSignInCardProps } from "./types";
