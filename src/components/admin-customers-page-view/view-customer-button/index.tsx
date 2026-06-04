"use client";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import type { ViewCustomerButtonProps } from "./types";

export const ViewCustomerButton = ({
  href,
  size = "small",
}: ViewCustomerButtonProps) => {
  const tShared = useTranslations("adminPage.shared");
  const label = tShared("actions.view");

  return (
    <Tooltip title={label}>
      <span>
        <IconButton aria-label={label} href={href} color="primary" size={size}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export type { ViewCustomerButtonProps } from "./types";
