"use client";

import { useState } from "react";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";

import type { ModalButtonProps } from "./types";

export const ModalButton = ({
  label,
  dialogTitle,
  dialogDescription,
  confirmLabel,
  cancelLabel,
  onConfirmAction,
  color = "error",
  variant = "text",
  size = "medium",
  disabled = false,
  icon,
  iconOnly = false,
  tooltip,
  ariaLabel,
}: ModalButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setOpen(false);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      await onConfirmAction();
    } catch {
      // Callers surface their own error UI (e.g. an Alert on the page);
      // closing here just returns the user to see it.
    }

    setIsSubmitting(false);
    setOpen(false);
  };

  const trigger = iconOnly ? (
    <IconButton
      aria-label={ariaLabel ?? label}
      color={color === "inherit" ? "default" : color}
      size={size}
      disabled={disabled || isSubmitting}
      onClick={() => setOpen(true)}
    >
      {icon}
    </IconButton>
  ) : (
    <Button
      type="button"
      color={color}
      variant={variant}
      size={size}
      disabled={disabled || isSubmitting}
      onClick={() => setOpen(true)}
      startIcon={!iconOnly ? icon : undefined}
    >
      {label}
    </Button>
  );

  const wrappedTrigger = tooltip ? (
    <Tooltip title={tooltip}>
      <span>{trigger}</span>
    </Tooltip>
  ) : (
    trigger
  );

  return (
    <>
      {wrappedTrigger}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogDescription}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={handleClose}
            color="inherit"
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export type { ModalButtonProps } from "./types";
