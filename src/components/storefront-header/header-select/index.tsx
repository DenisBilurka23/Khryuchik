"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { type MouseEvent, useId, useState } from "react";
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";

import type { HeaderSelectProps } from "./types";

export const HeaderSelect = ({
  value,
  label,
  options,
  onChangeAction,
  icon,
  disabled = false,
  sx,
}: HeaderSelectProps) => {
  const buttonId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase
        id={buttonId}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen ? "true" : undefined}
        aria-controls={isOpen ? `${buttonId}-menu` : undefined}
        disabled={disabled}
        onClick={handleOpen}
        sx={{
          minWidth: 64,
          height: 40,
          px: 1.5,
          borderRadius: "999px",
          bgcolor: "#fff",
          boxShadow: "0 1px 3px rgba(54, 33, 18, 0.04)",
          border: "1px solid #E8D6BF",
          justifyContent: "center",
          gap: 0.75,
          "&:hover": {
            borderColor: "#D96C82",
          },
          ...sx,
        }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box
            component="span"
            sx={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}
          >
            {icon}
          </Box>
          <Typography
            component="span"
            sx={{ fontSize: 15, fontWeight: 700, color: "text.primary" }}
          >
            {selectedOption?.selectedLabel ?? selectedOption?.label ?? value}
          </Typography>
          <KeyboardArrowDownRoundedIcon
            sx={{
              fontSize: 18,
              color: "text.secondary",
              ml: -0.25,
              display: { xs: "none", lg: "inline-flex" },
            }}
          />
        </Stack>
      </ButtonBase>

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
          <Paper
            elevation={0}
            sx={{
              minWidth: anchorEl?.offsetWidth ?? 96,
              width: "max-content",
              maxWidth: "calc(100vw - 32px)",
              borderRadius: "18px",
              boxShadow: "0 12px 30px rgba(54, 33, 18, 0.18)",
            }}
          >
            <MenuList
              aria-labelledby={buttonId}
              autoFocusItem={isOpen}
              sx={{ py: 0.75 }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === value}
                  onClick={() => {
                    handleClose();

                    if (option.value !== value) {
                      onChangeAction(option.value);
                    }
                  }}
                  sx={{
                    mx: 0.75,
                    my: 0.25,
                    borderRadius: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export type { HeaderSelectOption, HeaderSelectProps } from "./types";
