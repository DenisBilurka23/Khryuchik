import { AppBar, Box, Container, Toolbar } from "@mui/material";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Logo } from "../logo";
import { CartButton } from "./cart-button";
import { CountrySwitcher } from "./country-switcher";
import { FavoritesButton } from "./favorites-button";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { HeaderNavLinks } from "./nav-links";
import type { StorefrontHeaderProps, StorefrontNavItem } from "./types";
import { UserButton } from "./user-button";

export const StorefrontHeader = async ({
  locale,
  country,
  homeHref,
  localizedPaths,
  availableLocales,
  availableCountries,
  navigationPaths,
}: StorefrontHeaderProps) => {
  const t = await getTranslations({ locale, namespace: "storefront" });
  const navItems: StorefrontNavItem[] = [
    {
      key: "home",
      label: t("nav.home"),
      href: homeHref,
    },
    {
      key: "shop",
      label: t("nav.shop"),
      href: navigationPaths?.shop ?? "#shop",
    },
    {
      key: "story",
      label: t("nav.story"),
      href: navigationPaths?.story ?? "#story",
    },
    {
      key: "faq",
      label: t("nav.faq"),
      href: navigationPaths?.faq ?? "#faq",
    },
    {
      key: "contacts",
      label: t("nav.contacts"),
      href: navigationPaths?.contacts ?? "/contacts",
    },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          position: { xs: "fixed", md: "sticky" },
          top: 0,
          left: 0,
          right: 0,
          backdropFilter: "blur(14px)",
          background: "rgba(255, 252, 248, 0.94)",
          borderBottom: "1px solid var(--color-border-rose)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 72, md: 88 },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Link
              href={homeHref}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Logo
                markSize={48}
                title={t("brand.title")}
                subtitle={t("brand.subtitle")}
                textSx={{ display: { xs: "block", md: "none", lg: "block" } }}
                subtitleSx={{ display: { xs: "none", sm: "block" } }}
              />
            </Link>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <HeaderNavLinks items={navItems} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CountrySwitcher
                  country={country}
                  locale={locale}
                  availableCountries={availableCountries}
                  sx={{ minWidth: 64 }}
                />

                <LocaleSwitcher
                  locale={locale}
                  localizedPaths={localizedPaths}
                  availableLocales={availableLocales}
                  sx={{ minWidth: 64 }}
                />
              </Box>

              <MobileMenu
                locale={locale}
                country={country}
                localizedPaths={localizedPaths}
                availableLocales={availableLocales}
                availableCountries={availableCountries}
                navItems={navItems}
                cartHref={navigationPaths?.cart ?? "/cart"}
                homeHref={homeHref}
                favoritesHref={navigationPaths?.favorites ?? "/favorites"}
              />

              <UserButton
                locale={locale}
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              />

              <FavoritesButton
                href={navigationPaths?.favorites ?? "/favorites"}
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              />

              <CartButton href={navigationPaths?.cart ?? "/cart"} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        aria-hidden
        sx={{ display: { xs: "block", md: "none" }, height: 72 }}
      />
    </>
  );
};

export type { StorefrontHeaderProps, StorefrontNavItem } from "./types";
