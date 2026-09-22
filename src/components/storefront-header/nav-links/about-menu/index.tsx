"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Box,
  Button,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useId, useState } from "react";

import { navIconByKey } from "@/constants/navigation";
import { isNavItemActive } from "@/utils/active-nav";

import type { HeaderAboutMenuProps } from "./types";
import { navItemSx } from "../utils";

const panelSx = {
  minWidth: 250,
  p: 1,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-plate)",
  boxShadow: "var(--shadow-floating)",
} as const;

const menuItemSx = (active: boolean) =>
  ({
    alignItems: "flex-start",
    gap: 1.5,
    px: 1.5,
    py: 1.25,
    borderRadius: "var(--radius-field)",
    color: active ? "var(--color-action)" : "var(--color-text)",
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "var(--color-accent-pale)",
    },
  }) as const;

export const HeaderAboutMenu = ({ items, sx }: HeaderAboutMenuProps) => {
  const t = useTranslations("storefront");
  const pathname = usePathname();
  const buttonId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const active = items.some((item) => isNavItemActive(pathname, item.href));

  const handleToggle = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl((current) => (current ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.addEventListener("resize", handleClose);

    return () => window.removeEventListener("resize", handleClose);
  }, [isOpen]);

  return (
    <>
      <Button
        id={buttonId}
        color="inherit"
        disableRipple
        aria-haspopup="menu"
        aria-expanded={isOpen ? "true" : undefined}
        aria-controls={isOpen ? `${buttonId}-menu` : undefined}
        onClick={handleToggle}
        sx={{ ...navItemSx(active), ...sx }}
      >
        {t("nav.about")}

        <KeyboardArrowDownRoundedIcon
          sx={{
            fontSize: 18,
            ml: 0.5,
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "none",
          }}
        />
      </Button>

      <Popper
        id={`${buttonId}-menu`}
        anchorEl={anchorEl}
        open={isOpen}
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper elevation={0} sx={panelSx}>
            <MenuList
              aria-labelledby={buttonId}
              autoFocusItem={isOpen}
              sx={{ p: 0 }}
            >
              {items.map((item) => {
                const Icon = navIconByKey[item.key];
                const itemActive = isNavItemActive(pathname, item.href);

                return (
                  <MenuItem
                    key={item.key}
                    component={Link}
                    href={item.href}
                    selected={itemActive}
                    aria-current={itemActive ? "page" : undefined}
                    onClick={handleClose}
                    sx={menuItemSx(itemActive)}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        color: itemActive
                          ? "var(--color-action)"
                          : "var(--color-text-secondary)",
                        mt: 0.25,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>

                    <Box component="span">
                      <Typography
                        component="span"
                        sx={{ display: "block", fontSize: 15, fontWeight: 600 }}
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        component="span"
                        sx={{
                          display: "block",
                          mt: 0.25,
                          fontSize: 12.5,
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {t(`nav.aboutHints.${item.key}`)}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export type { HeaderAboutMenuProps } from "./types";
