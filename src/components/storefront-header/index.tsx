import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Toolbar,
} from "@mui/material";

import { Logo } from "../logo";
import { localeLabels } from "../utils";
import { CartButton } from "./CartButton";
import styles from "./storefront-header.module.css";
import type { StorefrontHeaderProps } from "./types";

export const StorefrontHeader = ({
  locale,
  dictionary,
  localizedPaths,
  navigationPaths,
}: StorefrontHeaderProps) => {
  const navItems = [
    {
      label: dictionary.nav.books,
      href: navigationPaths?.books ?? "#books",
      icon: <MenuBookOutlinedIcon fontSize="small" />,
    },
    {
      label: dictionary.nav.shop,
      href: navigationPaths?.shop ?? "#shop",
      icon: <StorefrontOutlinedIcon fontSize="small" />,
    },
    {
      label: dictionary.nav.story,
      href: navigationPaths?.story ?? "#story",
      icon: <AutoStoriesOutlinedIcon fontSize="small" />,
    },
    {
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
          <Logo
            title={dictionary.brand.title}
            subtitle={dictionary.brand.subtitle}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                color="inherit"
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Paper
              aria-label={dictionary.localeSwitcherLabel}
              elevation={0}
              className={styles.localeSwitcher}
              sx={{ borderRadius: "999px" }}
            >
              <Stack direction="row" spacing={0}>
                {(
                  Object.keys(localeLabels) as (keyof typeof localeLabels)[]
                ).map((targetLocale) => (
                  <Button
                    key={targetLocale}
                    href={localizedPaths[targetLocale]}
                    variant="text"
                    color="inherit"
                    className={styles.localeButton}
                    sx={{
                      backgroundColor:
                        targetLocale === locale ? "#D96C82" : "transparent",
                      color: targetLocale === locale ? "#fff" : "#27272A",
                      "&:hover": {
                        backgroundColor:
                          targetLocale === locale
                            ? "#D96C82"
                            : "rgba(217, 108, 130, 0.06)",
                      },
                    }}
                  >
                    {localeLabels[targetLocale]}
                  </Button>
                ))}
              </Stack>
            </Paper>

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
