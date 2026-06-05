"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useId, useState, type MouseEvent } from "react";
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
          minWidth: 96,
          height: 40,
          px: 1.5,
          borderRadius: "999px",
          bgcolor: "#fff",
          boxShadow: "0 1px 3px rgba(54, 33, 18, 0.04)",
          border: "1px solid #E8D6BF",
          justifyContent: "space-between",
          gap: 1,
          "&:hover": {
            borderColor: "#D96C82",
          },
          ...sx,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
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
        </Stack>
        <KeyboardArrowDownRoundedIcon sx={{ color: "text.secondary" }} />
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
        sx={{
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
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