import type { ReactNode } from "react";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { AppBar, Box, Button, Container, Stack, Toolbar } from "@mui/material";
import Link from "next/link";

import { Logo } from "../logo";
import { CartButton } from "./cart-button";
import { CountrySwitcher } from "./country-switcher";
import { FavoritesButton } from "./favorites-button";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import styles from "./storefront-header.module.css";
import type { StorefrontHeaderProps, StorefrontNavItem } from "./types";
import { UserButton } from "./user-button";

export const StorefrontHeader = ({
  locale,
  country,
  dictionary,
  homeHref,
  localizedPaths,
  navigationPaths,
}: StorefrontHeaderProps) => {
  const navItems: Array<StorefrontNavItem & { icon: ReactNode }> = [
    {
      key: "books",
      label: dictionary.nav.books,
      href: navigationPaths?.books ?? "#books",
      icon: <MenuBookOutlinedIcon fontSize="small" />,
    },
    {
      key: "shop",
      label: dictionary.nav.shop,
      href: navigationPaths?.shop ?? "#shop",
      icon: <StorefrontOutlinedIcon fontSize="small" />,
    },
    {
      key: "story",
      label: dictionary.nav.story,
      href: navigationPaths?.story ?? "#story",
      icon: <AutoStoriesOutlinedIcon fontSize="small" />,
    },
    {
      key: "faq",
      label: dictionary.nav.faq,
      href: navigationPaths?.faq ?? "#faq",
      icon: <LocalShippingOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      className={styles.appBar}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ py: 1.5, justifyContent: "space-between", gap: 2 }}
        >
          <Link
            href={homeHref}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Logo
              title={dictionary.brand.title}
              subtitle={dictionary.brand.subtitle}
            />
          </Link>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit" startIcon={item.icon} component="span">
                  {item.label}
                </Button>
              </Link>
            ))}
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <CountrySwitcher
                country={country}
                locale={locale}
                label={dictionary.countrySwitcherLabel}
                sx={{ minWidth: 92 }}
              />

              <LocaleSwitcher
                locale={locale}
                label={dictionary.localeSwitcherLabel}
                localizedPaths={localizedPaths}
                sx={{ minWidth: 92 }}
              />
            </Stack>

            <MobileMenu
              brand={dictionary.brand}
              locale={locale}
              country={country}
              localizedPaths={localizedPaths}
              navItems={navItems.map(({ key, label, href }) => ({
                key,
                label,
                href,
              }))}
              cartHref={navigationPaths?.cart ?? "/cart"}
              cartLabel={dictionary.cartLabel}
              localeSwitcherLabel={dictionary.localeSwitcherLabel}
              countrySwitcherLabel={dictionary.countrySwitcherLabel}
              homeHref={homeHref}
            />

            <UserButton
              locale={locale}
              accountLabel={dictionary.userMenu.account}
              signInLabel={dictionary.userMenu.signIn}
            />

            <FavoritesButton
              href={navigationPaths?.favorites ?? "/favorites"}
              label={dictionary.favoritesLabel}
            />

            <CartButton
              href={navigationPaths?.cart ?? "/cart"}
              label={dictionary.cartLabel}
              className={styles.cartButton}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export type { StorefrontHeaderProps, StorefrontNavItem } from "./types";
