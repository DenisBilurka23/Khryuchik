import { useState } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { inputFieldSx } from "@/theme/sx";

import type { RegisterFieldProps } from "./types";

const wrapperSx = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
} as const;

const labelSx = {
  mb: 1,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--color-text)",
} as const;

const requiredMarkSx = {
  ml: 0.5,
  color: "var(--color-accent)",
} as const;

const adornmentSx = {
  color: "var(--color-accent)",
  "& .MuiSvgIcon-root": { fontSize: 20 },
} as const;

export const RegisterField = ({
  id,
  label,
  placeholder,
  value,
  autoComplete,
  onChange,
  type = "text",
}: RegisterFieldProps) => {
  const t = useTranslations("registerPage");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isSecret = type === "password";

  return (
    <Box sx={wrapperSx}>
      <Typography component="label" htmlFor={id} sx={labelSx}>
        {label}
        <Box component="span" aria-hidden sx={requiredMarkSx}>
          *
        </Box>
      </Typography>

      <TextField
        id={id}
        type={isSecret && isPasswordVisible ? "text" : type}
        sx={inputFieldSx}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        fullWidth
        slotProps={{
          input: {
            endAdornment: isSecret ? (
              <InputAdornment position="end" sx={adornmentSx}>
                <IconButton
                  edge="end"
                  size="small"
                  aria-label={
                    isPasswordVisible ? t("hidePassword") : t("showPassword")
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
            ) : null,
          },
        }}
      />
    </Box>
  );
};

export type { RegisterFieldProps, RegisterFieldType } from "./types";
