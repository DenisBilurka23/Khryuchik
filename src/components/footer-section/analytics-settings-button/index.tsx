"use client";

import { ButtonBase } from "@mui/material";

import { openAnalyticsConsentSettings } from "@/stores/analytics";

import type { AnalyticsSettingsButtonProps } from "./types";

const buttonSx = {
  font: "inherit",
  textAlign: "left",
} as const;

export const AnalyticsSettingsButton = ({
  label,
  sx,
}: AnalyticsSettingsButtonProps) => (
  <ButtonBase
    disableRipple
    onClick={openAnalyticsConsentSettings}
    sx={[buttonSx, ...(Array.isArray(sx) ? sx : [sx])]}
  >
    {label}
  </ButtonBase>
);
