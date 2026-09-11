"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdminEditLinkButtonProps } from "./types";

export const AdminEditLinkButton = ({
  href,
  size = "small",
}: AdminEditLinkButtonProps) => {
  const tShared = useTranslations("adminPage.shared");
  const label = tShared("actions.edit");

  return (
    <Tooltip title={label}>
      <span>
        <IconButton aria-label={label} href={href} color="primary" size={size}>
          <EditOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export type { AdminEditLinkButtonProps } from "./types";