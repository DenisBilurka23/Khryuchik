"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import type { EditProductButtonProps } from "./types";

export const EditProductButton = ({
  href,
  size = "small",
}: EditProductButtonProps) => {
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

export type { EditProductButtonProps } from "./types";