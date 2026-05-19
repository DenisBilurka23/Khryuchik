"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import type { EditCustomerButtonProps } from "./types";

export const EditCustomerButton = ({
  href,
  size = "small",
}: EditCustomerButtonProps) => {
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

export type { EditCustomerButtonProps } from "./types";