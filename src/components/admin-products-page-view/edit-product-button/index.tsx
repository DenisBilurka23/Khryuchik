"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton, Tooltip } from "@mui/material";

import type { EditProductButtonProps } from "./types";

export const EditProductButton = ({
  href,
  label,
  size = "small",
}: EditProductButtonProps) => (
  <Tooltip title={label}>
    <span>
      <IconButton aria-label={label} href={href} color="primary" size={size}>
        <EditOutlinedIcon />
      </IconButton>
    </span>
  </Tooltip>
);

export type { EditProductButtonProps } from "./types";