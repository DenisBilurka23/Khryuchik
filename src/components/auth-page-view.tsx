"use client";

import { useState, type SyntheticEvent } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import type { AuthPageViewProps } from "./auth-page-view.types";

export const AuthPageView = ({
  dictionary,
  callbackUrl,
  isGoogleEnabled,
  registerHref,
  forgotPasswordHref,
}: AuthPageViewProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  const handleCredentialsSignIn = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsCredentialsLoading(true);
    setErrorMessage(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsCredentialsLoading(false);

    if (result?.error) {
      setErrorMessage(dictionary.invalidCredentials);
      return;
    }

    if (result?.url) {
      router.push(result.url);
      router.refresh();
      return;
    }

    setErrorMessage(dictionary.unexpectedError);
  };

  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "calc(100vh - 140px)" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
        px: 2,
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
              <Typography color="text.secondary" sx={{ maxWidth: 620, lineHeight: 1.8 }}>
                {dictionary.lead}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {dictionary.chips.map((chip) => (
                <Chip key={chip} label={chip} sx={{ bgcolor: "#fff", border: "1px solid #E8D6BF" }} />
              ))}
            </Stack>

            <Card sx={{ border: "1px solid #F0DFC8", bgcolor: "rgba(255,255,255,0.86)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.5}>
                  <Box component="form" onSubmit={handleCredentialsSignIn}>
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
                          <LockOutlinedIcon />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
                            {dictionary.credentialsTitle}
                          </Typography>
                          <Typography color="text.secondary">
                            {dictionary.credentialsLead}
                          </Typography>
                        </Box>
                      </Stack>

                      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                      <TextField
                        label={dictionary.emailLabel}
                        placeholder={dictionary.emailPlaceholder}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                        fullWidth
                      />
                      <TextField
                        label={dictionary.passwordLabel}
                        placeholder={dictionary.passwordPlaceholder}
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                        fullWidth
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={isCredentialsLoading}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        {dictionary.loginButton}
                      </Button>

                      <Typography color="text.secondary">
                        <Box component={Link} href={forgotPasswordHref} sx={{ color: "primary.main", fontWeight: 700 }}>
                          {dictionary.forgotPasswordLinkLabel}
                        </Box>
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Divider sx={{ flex: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {dictionary.dividerLabel}
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "20px",
                        bgcolor: "#FCE5EA",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LockOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
                        {dictionary.googleTitle}
                      </Typography>
                      <Typography color="text.secondary">
                        {isGoogleEnabled ? dictionary.ready : dictionary.unavailable}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    disabled={!isGoogleEnabled}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    {dictionary.googleButton}
                  </Button>

                  <Typography color="text.secondary">
                    {dictionary.registerPrompt}{" "}
                    <Box component={Link} href={registerHref} sx={{ color: "primary.main", fontWeight: 700 }}>
                      {dictionary.registerLinkLabel}
                    </Box>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};