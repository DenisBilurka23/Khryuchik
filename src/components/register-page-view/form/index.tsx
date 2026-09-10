import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { IconTile, Plate } from "@/components/primitives";

import { RegisterField } from "../field";

import type { RegisterFormProps } from "./types";

const cardSx = {
  borderRadius: "var(--radius-card)",
  boxShadow: "var(--shadow-floating)",
  p: { xs: "22px 18px", md: "32px 34px" },
} as const;

const headerSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.75,
  mb: 3,
} as const;

const iconTileSx = {
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent-pale)",
  color: "var(--color-action)",
} as const;

const titleSx = {
  fontSize: { xs: 24, md: 30 },
  lineHeight: 1.2,
} as const;

const alertSx = {
  mb: 2.5,
  borderRadius: "var(--radius-field)",
} as const;

const fieldsSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: "16px 18px",
} as const;

const submitSx = {
  minHeight: 54,
  mt: 3,
  borderRadius: "var(--radius-field)",
  fontSize: 17,
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": { background: "var(--color-action-hover)" },
} as const;

export const RegisterForm = ({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  errorMessage,
  isSubmitting,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: RegisterFormProps) => {
  const t = useTranslations("registerPage");

  return (
    <Plate pad="none" sx={cardSx}>
      <Box sx={headerSx}>
        <IconTile tone="accent" sx={iconTileSx}>
          <BadgeOutlinedIcon />
        </IconTile>

        <Typography variant="h3" sx={titleSx}>
          {t("formTitle")}
        </Typography>
      </Box>

      <Box component="form" onSubmit={onSubmit}>
        <Box aria-live="polite">
          {errorMessage ? (
            <Alert severity="error" sx={alertSx}>
              {errorMessage}
            </Alert>
          ) : null}
        </Box>

        <Box sx={fieldsSx}>
          <RegisterField
            id="register-first-name"
            label={t("firstNameLabel")}
            placeholder={t("firstNamePlaceholder")}
            value={firstName}
            autoComplete="given-name"
            onChange={onFirstNameChange}
          />

          <RegisterField
            id="register-last-name"
            label={t("lastNameLabel")}
            placeholder={t("lastNamePlaceholder")}
            value={lastName}
            autoComplete="family-name"
            onChange={onLastNameChange}
          />

          <RegisterField
            id="register-email"
            type="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            value={email}
            autoComplete="email"
            onChange={onEmailChange}
          />

          <RegisterField
            id="register-phone"
            type="tel"
            label={t("phoneLabel")}
            placeholder={t("phonePlaceholder")}
            value={phone}
            autoComplete="tel"
            onChange={onPhoneChange}
          />

          <RegisterField
            id="register-password"
            type="password"
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            value={password}
            autoComplete="new-password"
            onChange={onPasswordChange}
          />

          <RegisterField
            id="register-confirm-password"
            type="password"
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            autoComplete="new-password"
            onChange={onConfirmPasswordChange}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={submitSx}
          loading={isSubmitting}
          fullWidth
        >
          {t("submitButton")}
        </Button>
      </Box>
    </Plate>
  );
};

export type { RegisterFormProps } from "./types";
