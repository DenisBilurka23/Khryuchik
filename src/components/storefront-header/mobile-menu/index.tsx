"use client";

import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
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
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { getLocalizedPath } from "@/utils";
import { isNavItemActive } from "@/utils/active-nav";

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
  contacts: <ChatBubbleOutlineOutlinedIcon fontSize="small" />,
  account: <PersonOutlineIcon fontSize="small" />,
  favorites: <FavoriteBorderIcon fontSize="small" />,
};

export const MobileMenu = ({
  locale,
  country,
  localizedPaths,
  availableLocales,
  navItems,
  cartHref,
  homeHref,
  favoritesHref,
}: MobileMenuProps) => {
  const t = useTranslations("storefront");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const accountHref = session
    ? getLocalizedPath(locale, "/account")
    : getLocalizedPath(locale, "/login");
  const accountActionLabel = session ? t("userMenu.account") : t("userMenu.signIn");
  const menuItems: MobileMenuItem[] = [
    ...navItems,
    {
      key: "account",
      label: accountActionLabel,
      href: accountHref,
    },
    {
      key: "favorites",
      label: t("favoritesLabel"),
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
              <Logo title={t("brand.title")} subtitle={t("brand.subtitle")} />
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
                {t("countrySwitcherLabel")}
              </Typography>
              <CountrySwitcher
                country={country}
                locale={locale}
                sx={{ minWidth: 0, width: "100%" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.75 }}
              >
                {t("localeSwitcherLabel")}
              </Typography>
              <LocaleSwitcher
                locale={locale}
                localizedPaths={localizedPaths}
                availableLocales={availableLocales}
                sx={{ minWidth: 0, width: "100%" }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#E8D6BF" }} />

          <List sx={{ p: 0 }}>
            {menuItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton
                    component="span"
                    aria-current={active ? "page" : undefined}
                    sx={{
                      borderRadius: "18px",
                      mb: 1,
                      bgcolor: active ? "secondary.main" : "#fff",
                      border: "1px solid",
                      borderColor: active ? "primary.main" : "#F0DFC8",
                      color: active ? "primary.main" : "inherit",
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 38,
                        color: active ? "primary.main" : "text.primary",
                      }}
                    >
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
              );
            })}
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
              {t("cartLabel")}
            </Button>
          </Link>
        </Box>
      </Drawer>
    </>
  );
};

export type { MobileMenuProps } from "./types";