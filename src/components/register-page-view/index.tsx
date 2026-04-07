"use client";

import { useState, type SyntheticEvent } from "react";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { registerUserClient } from "@/client-api/auth";
import { mergeGuestWishlistAfterLogin } from "@/client-api/wishlist";

import type { RegisterPageViewProps } from "./types";
import { getRegisterErrorMessage } from "./utils";

export const RegisterPageView = ({
  dictionary,
  callbackUrl,
  loginHref,
}: RegisterPageViewProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage(dictionary.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await registerUserClient({ name, email, phone, password });

    if (!response.ok) {
      const data = response.data;
      setErrorMessage(getRegisterErrorMessage(data?.error ?? "unexpected_error", dictionary));
      setIsSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (signInResult?.url) {
      await mergeGuestWishlistAfterLogin();
      router.push(signInResult.url);
      router.refresh();
      return;
    }

    router.push(loginHref);
    router.refresh();
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
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
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
                        <BadgeOutlinedIcon />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
                        {dictionary.submitButton}
                      </Typography>
                    </Stack>

                    {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                    <TextField
                      label={dictionary.nameLabel}
                      placeholder={dictionary.namePlaceholder}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      required
                      fullWidth
                    />
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
                      label={dictionary.phoneLabel}
                      placeholder={dictionary.phonePlaceholder}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      required
                      fullWidth
                    />
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
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                      fullWidth
                    />

                    <Button type="submit" variant="contained" size="large" loading={isSubmitting} sx={{ alignSelf: "flex-start" }}>
                      {dictionary.submitButton}
                    </Button>

                    <Typography color="text.secondary">
                      {dictionary.loginPrompt}{" "}
                      <Box component={Link} href={loginHref} sx={{ color: "primary.main", fontWeight: 700 }}>
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

export type { RegisterPageViewProps } from "./types";