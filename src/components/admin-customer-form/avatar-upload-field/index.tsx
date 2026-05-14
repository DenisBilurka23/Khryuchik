"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { AvatarUploadButton } from "@/components/avatar-upload-button";

import type { AdminCustomerAvatarUploadFieldProps } from "./types";

export const AdminCustomerAvatarUploadField = ({
  name,
  removeInputName,
  label,
  helperText,
  buttonLabel,
  replaceButtonLabel,
  removeButtonLabel,
  emptyLabel,
  currentImageSrc,
  currentImageAlt,
}: AdminCustomerAvatarUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const inputId = `${name}-input`;
  const [previewSrc, setPreviewSrc] = useState<string | null>(currentImageSrc ?? null);
  const [isMarkedForRemoval, setIsMarkedForRemoval] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const clearSelectedFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Stack gap={1.25} alignItems={{ xs: "center", md: "flex-start" }}>
      <input type="hidden" name={removeInputName} value={isMarkedForRemoval ? "1" : "0"} />
      <input
        id={inputId}
        ref={inputRef}
        hidden
        type="file"
        name={name}
        accept="image/*"
        onClick={(event) => {
          event.currentTarget.value = "";
        }}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          clearPreviewUrl();
          const nextPreviewUrl = URL.createObjectURL(file);
          previewUrlRef.current = nextPreviewUrl;
          setPreviewSrc(nextPreviewUrl);
          setIsMarkedForRemoval(false);
        }}
      />

      <AvatarUploadButton
        imageSrc={previewSrc}
        imageAlt={currentImageAlt}
        ariaLabel={`${label}: ${previewSrc ? replaceButtonLabel : buttonLabel}`}
        title={helperText}
        size={120}
        overlayIconSize={28}
        badgeSize={36}
        badgeIconSize={18}
        avatarSx={{ border: "4px solid #fff" }}
        onClickAction={() => {
          inputRef.current?.click();
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: 180,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {previewSrc ? replaceButtonLabel : buttonLabel}
      </Typography>

      {!previewSrc ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            maxWidth: 180,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {emptyLabel}
        </Typography>
      ) : null}

      {previewSrc ? (
        <Button
          type="button"
          color="inherit"
          onClick={() => {
            clearPreviewUrl();
            clearSelectedFile();
            setPreviewSrc(null);
            setIsMarkedForRemoval(true);
          }}
          sx={{
            minWidth: 0,
            px: 0.5,
            color: "text.secondary",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "transparent",
              color: "text.primary",
            },
          }}
        >
          {removeButtonLabel}
        </Button>
      ) : null}
    </Stack>
  );
};

export type { AdminCustomerAvatarUploadFieldProps } from "./types";