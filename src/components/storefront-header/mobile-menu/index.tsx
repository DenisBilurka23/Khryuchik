"use client";

import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { getLocalizedPath } from "@/utils";

import { Logo } from "../../logo";
import { CountrySwitcher } from "../country-switcher";
import { LocaleSwitcher } from "../locale-switcher";

import type { MobileMenuProps } from "./types";

type MobileMenuItem = MobileMenuProps["navItems"][number] | {
  key: "account" | "favorites";
  label: string;
  href: string;
};

const iconByKey: Record<MobileMenuItem["key"], React.ReactNode> = {
  shop: <StorefrontOutlinedIcon fontSize="small" />,
  story: <AutoStoriesOutlinedIcon fontSize="small" />,
  faq: <LocalShippingOutlinedIcon fontSize="small" />,
  account: <PersonOutlineIcon fontSize="small" />,
  favorites: <FavoriteBorderIcon fontSize="small" />,
};

export const MobileMenu = ({
  brand,
  locale,
  country,
  localizedPaths,
  navItems,
  cartHref,
  cartLabel,
  localeSwitcherLabel,
  countrySwitcherLabel,
  homeHref,
  accountLabel,
  signInLabel,
  favoritesHref,
  favoritesLabel,
}: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const accountHref = session
    ? getLocalizedPath(locale, "/account")
    : getLocalizedPath(locale, "/login");
  const accountActionLabel = session ? accountLabel : signInLabel;
  const menuItems: MobileMenuItem[] = [
    ...navItems,
    {
      key: "account",
      label: accountActionLabel,
      href: accountHref,
    },
    {
      key: "favorites",
      label: favoritesLabel,
      href: favoritesHref,
    },
  ];

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        sx={{
          display: { xs: "inline-flex", md: "none" },
          width: 40,
          height: 40,
          borderRadius: "999px",
          border: "1px solid #E8D6BF",
          bgcolor: "#fff",
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxWidth: "100%",
              bgcolor: "#FFF8F0",
            },
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link
              href={homeHref}
              onClick={() => setOpen(false)}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Logo title={brand.title} subtitle={brand.subtitle} />
            </Link>

            <IconButton
              onClick={() => setOpen(false)}
              sx={{ bgcolor: "#fff", border: "1px solid #E8D6BF" }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.75 }}
              >
                {countrySwitcherLabel}
              </Typography>
              <CountrySwitcher
                country={country}
                locale={locale}
                label={countrySwitcherLabel}
                sx={{ minWidth: 0, width: "100%" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.75 }}
              >
                {localeSwitcherLabel}
              </Typography>
              <LocaleSwitcher
                locale={locale}
                label={localeSwitcherLabel}
                localizedPaths={localizedPaths}
                sx={{ minWidth: 0, width: "100%" }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#E8D6BF" }} />

          <List sx={{ p: 0 }}>
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton
                  component="span"
                  sx={{
                    borderRadius: "18px",
                    mb: 1,
                    bgcolor: "#fff",
                    border: "1px solid #F0DFC8",
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: "text.primary" }}>
                    {iconByKey[item.key]}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: { fontWeight: 700 },
                      },
                    }}
                  />
                </ListItemButton>
              </Link>
            ))}
          </List>

          <Link
            href={cartHref}
            onClick={() => setOpen(false)}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              fullWidth
              variant="contained"
              component="span"
              sx={{
                mt: 2,
                bgcolor: "#18181B",
                "&:hover": { bgcolor: "#09090B" },
              }}
            >
              {cartLabel}
            </Button>
          </Link>
        </Box>
      </Drawer>
    </>
  );
};

export type { MobileMenuProps } from "./types";