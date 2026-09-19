"use client";

import { useState } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton, InputAdornment, TextField } from "@mui/material";

import type { AccountPasswordFieldProps } from "./types";

const adornmentSx = {
  color: "var(--color-accent)",
  "& .MuiSvgIcon-root": { fontSize: 20 },
} as const;

export const AccountPasswordField = ({
  label,
  value,
  autoComplete,
  onChange,
  required = false,
  showPasswordLabel,
  hidePasswordLabel,
}: AccountPasswordFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TextField
      fullWidth
      label={label}
      type={isPasswordVisible ? "text" : "password"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      required={required}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end" sx={adornmentSx}>
              <IconButton
                edge="end"
                size="small"
                aria-label={
                  isPasswordVisible ? hidePasswordLabel : showPasswordLabel
                }
                onClick={() => setIsPasswordVisible((visible) => !visible)}
              >
                {isPasswordVisible ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export type { AccountPasswordFieldProps } from "./types";
