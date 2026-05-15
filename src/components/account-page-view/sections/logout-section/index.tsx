import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { SectionCard } from "../../shared";

import type { LogoutSectionProps } from "./types";

export const LogoutSection = ({ onSignOut }: LogoutSectionProps) => {
  const t = useTranslations("accountPage");

  return (
    <SectionCard
      title={t("signOutTitle")}
      action={<Button variant="contained" onClick={onSignOut}>{t("signOutButton")}</Button>}
    >
      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {t("signOutText")}
      </Typography>
    </SectionCard>
  );
};

export type { LogoutSectionProps } from "./types";