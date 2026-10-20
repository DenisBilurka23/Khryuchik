"use client";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Button } from "@mui/material";

import { ArrowLink } from "@/components/arrow-link";
import { useEntertainmentView } from "@/hooks/useEntertainmentView";
import { getEntertainmentDownloadPath } from "@/utils";

import type { EntertainmentDownloadLinkProps } from "./types";

export const EntertainmentDownloadLink = ({
  slug,
  label,
  variant = "text",
  sx,
}: EntertainmentDownloadLinkProps) => {
  const registerView = useEntertainmentView(slug);
  const isProminent = variant === "contained";

  if (!isProminent) {
    return (
      <ArrowLink
        href={getEntertainmentDownloadPath(slug)}
        label={label}
        size="sm"
        download
        onClick={registerView}
        sx={sx}
      />
    );
  }

  return (
    <Button
      component="a"
      href={getEntertainmentDownloadPath(slug)}
      download
      onClick={registerView}
      variant="contained"
      size="large"
      startIcon={<DownloadRoundedIcon />}
      sx={sx}
    >
      {label}
    </Button>
  );
};

export type { EntertainmentDownloadLinkProps } from "./types";
