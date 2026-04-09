"use client";

import { type SyntheticEvent, useState } from "react";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { confirmPasswordResetClient } from "@/client-api/auth";

import type { ResetPasswordPageViewProps } from "./types";

export const ResetPasswordPageView = ({
  dictionary,
  token,
  loginHref,
}: ResetPasswordPageViewProps) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(dictionary.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const response = await confirmPasswordResetClient(token, password);
    const data = response.data;

    setIsSubmitting(false);

    if (!response.ok) {
      switch (data?.error) {
        case "password_too_short":
          setErrorMessage(dictionary.passwordTooShort);
          return;
        case "invalid_token":
          setErrorMessage(dictionary.invalidToken);
          return;
        default:
          setErrorMessage(dictionary.unexpectedError);
          return;
      }
    }

    setSuccessMessage(dictionary.successMessage);
    setTimeout(() => {
      router.push(loginHref);
      router.refresh();
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "calc(100vh - 140px)" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 960,
          border: "1px solid #F0DFC8",
          background:
            "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.35), transparent 28%), #fff",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3.5}>
            <Stack spacing={1.5}>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {dictionary.eyebrow}
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 52 } }}>
                {dictionary.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ maxWidth: 620, lineHeight: 1.8 }}
              >
                {dictionary.lead}
              </Typography>
            </Stack>

            <Card
              sx={{
                border: "1px solid #F0DFC8",
                bgcolor: "rgba(255,255,255,0.86)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "20px",
                          bgcolor: "#FFF2D6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LockResetOutlinedIcon />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
                        {dictionary.submitButton}
                      </Typography>
                    </Stack>

                    {errorMessage ? (
                      <Alert severity="error">{errorMessage}</Alert>
                    ) : null}
                    {successMessage ? (
                      <Alert severity="success">{successMessage}</Alert>
                    ) : null}

                    <TextField
                      label={dictionary.passwordLabel}
                      placeholder={dictionary.passwordPlaceholder}
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                      fullWidth
                    />
                    <TextField
                      label={dictionary.confirmPasswordLabel}
                      placeholder={dictionary.confirmPasswordPlaceholder}
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      required
                      fullWidth
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      {dictionary.submitButton}
                    </Button>

                    <Typography color="text.secondary">
                      <Box
                        component={Link}
                        href={loginHref}
                        sx={{ color: "primary.main", fontWeight: 700 }}
                      >
                        {dictionary.loginLinkLabel}
                      </Box>
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export type { ResetPasswordPageViewProps } from "./types";
