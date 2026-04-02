import { Button, Typography } from "@mui/material";

import { SectionCard } from "../../shared";

import type { LogoutSectionProps } from "./types";

export const LogoutSection = ({ dictionary, onSignOut }: LogoutSectionProps) => {
  return (
    <SectionCard
      title={dictionary.signOutTitle}
      action={<Button variant="contained" onClick={onSignOut}>{dictionary.signOutButton}</Button>}
    >
      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {dictionary.signOutText}
      </Typography>
    </SectionCard>
  );
};

export type { LogoutSectionProps } from "./types";