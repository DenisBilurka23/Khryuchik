import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { inputFieldSx } from "@/theme/sx";

import type { AuthCredentialsFormProps } from "./types";

const labelSx = {
  mb: 1,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--color-text)",
} as const;

const fieldSx = { display: "flex", flexDirection: "column" } as const;

const inputSx = {
  ...inputFieldSx,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-rose)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-accent)",
  },
} as const;

const adornmentSx = {
  color: "var(--color-accent)",
  "& .MuiSvgIcon-root": { fontSize: 20 },
} as const;

const submitSx = {
  minHeight: 50,
  mt: 3,
  borderRadius: "var(--radius-field)",
  fontSize: 16,
  "&:hover": { background: "var(--color-action-hover)" },
} as const;

const forgotLinkSx = {
  display: "block",
  width: "fit-content",
  mx: "auto",
  mt: 2,
  fontSize: 14,
  fontWeight: 500,
  color: "var(--color-action)",
  textDecoration: "underline",
  textUnderlineOffset: 3,
  borderRadius: "var(--radius-button)",
  transition: "color 0.2s ease",
  "&:hover": { color: "var(--color-accent)" },
} as const;

export const AuthCredentialsForm = ({
  email,
  password,
  errorMessage,
  isLoading,
  forgotPasswordHref,
  canResendVerification,
  isResendingVerification,
  resendVerificationMessage,
  onEmailChange,
  onPasswordChange,
  onResendVerification,
  onSubmit,
}: AuthCredentialsFormProps) => {
  const t = useTranslations("authPage");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Box component="form" onSubmit={onSubmit}>
      {errorMessage ? (
        <Alert
          severity="error"
          sx={{ mb: 2.5, borderRadius: "var(--radius-field)" }}
          action={
            canResendVerification ? (
              <Button
                color="inherit"
                size="small"
                loading={isResendingVerification}
                onClick={onResendVerification}
              >
                {t("resendVerification")}
              </Button>
            ) : null
          }
        >
          {errorMessage}
        </Alert>
      ) : null}

      {resendVerificationMessage ? (
        <Alert
          severity="info"
          sx={{ mb: 2.5, borderRadius: "var(--radius-field)" }}
        >
          {resendVerificationMessage}
        </Alert>
      ) : null}

      <Box sx={fieldSx}>
        <Typography component="label" htmlFor="login-email" sx={labelSx}>
          {t("emailLabel")}
        </Typography>
        <TextField
          id="login-email"
          type="email"
          sx={inputSx}
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          autoComplete="email"
          required
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={adornmentSx}>
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ ...fieldSx, mt: 2.25 }}>
        <Typography component="label" htmlFor="login-password" sx={labelSx}>
          {t("passwordLabel")}
        </Typography>
        <TextField
          id="login-password"
          type={isPasswordVisible ? "text" : "password"}
          sx={inputSx}
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          autoComplete="current-password"
          required
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={adornmentSx}>
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
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
              ),
            },
          }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        sx={submitSx}
        loading={isLoading}
        fullWidth
      >
        {t("loginButton")}
      </Button>

      <Box component={Link} href={forgotPasswordHref} sx={forgotLinkSx}>
        {t("forgotPasswordLinkLabel")}
      </Box>
    </Box>
  );
};

export type { AuthCredentialsFormProps } from "./types";
