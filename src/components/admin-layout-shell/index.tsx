import Link from "next/link";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { StorefrontThemeProvider } from "@/components/providers/storefront-theme-provider";

import { AdminLocaleSwitcher } from "./locale-switcher";
import { AdminNavigation } from "../admin-navigation";
import type { AdminLayoutShellProps } from "./types";

export const AdminLayoutShell = ({
  email,
  profileHref,
  locale,
  dictionary,
  navItems,
  children,
}: AdminLayoutShellProps) => {
  return (
    <StorefrontThemeProvider>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            backdropFilter: "blur(14px)",
            bgcolor: "rgba(255,248,240,0.90)",
            borderBottom: "1px solid #F0DFC8",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ py: 1.5, justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0 }} />

              <Stack direction="row" spacing={1} alignItems="center">
                <AdminLocaleSwitcher
                  locale={locale}
                  label={dictionary.layout.languageSwitcherLabel}
                />
                <Button href="/admin/products/new" variant="contained" startIcon={<AddOutlinedIcon />}>
                  {dictionary.layout.addProduct}
                </Button>
                <Link
                  href={profileHref}
                  aria-label={email}
                  style={{ display: "inline-flex", borderRadius: "999px" }}
                >
                  <Avatar sx={{ bgcolor: "#FCE5EA", color: "#27272A" }}>
                    {email[0]?.toUpperCase() ?? "A"}
                  </Avatar>
                </Link>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "320px minmax(0, 1fr)" },
              gap: 3,
            }}
          >
            <Paper
              component="aside"
              sx={{
                p: 2,
                borderRadius: "28px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
                alignSelf: { lg: "flex-start" },
                position: { lg: "sticky" },
                top: 116,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1, py: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "18px",
                    bgcolor: "#F7C9D1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  🐷
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Хрючик</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary.layout.brandSubtitle}
                  </Typography>
                </Box>
              </Stack>

              <AdminNavigation items={navItems} />
            </Paper>

            <Box sx={{ minWidth: 0 }}>{children}</Box>
          </Box>
        </Container>
      </Box>
    </StorefrontThemeProvider>
  );
};
export type { AdminLayoutShellProps } from "./types";