"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton, Tooltip } from "@mui/material";

import type { EditCustomerButtonProps } from "./types";

export const EditCustomerButton = ({
  href,
  label,
  size = "small",
}: EditCustomerButtonProps) => (
  <Tooltip title={label}>
    <span>
      <IconButton aria-label={label} href={href} color="primary" size={size}>
        <EditOutlinedIcon />
      </IconButton>
    </span>
  </Tooltip>
);

export type { EditCustomerButtonProps } from "./types";