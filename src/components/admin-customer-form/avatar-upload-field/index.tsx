"use client";

import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, ButtonBase, Stack, Typography } from "@mui/material";

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

      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <ButtonBase
          type="button"
          aria-label={`${label}: ${previewSrc ? replaceButtonLabel : buttonLabel}`}
          title={helperText}
          onClick={() => {
            inputRef.current?.click();
          }}
          sx={{
            display: "block",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 16px 36px rgba(196, 155, 120, 0.18)",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 20px 42px rgba(196, 155, 120, 0.24)",
            },
            "&:hover .avatar-upload-overlay, &:focus-visible .avatar-upload-overlay": {
              opacity: 1,
            },
          }}
        >
          <Avatar
            src={previewSrc ?? undefined}
            alt={currentImageAlt}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #fff",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(39, 33, 42, 0.34)",
              color: "#fff",
              opacity: previewSrc ? 0 : 1,
              transition: "opacity 160ms ease",
            }}
            className="avatar-upload-overlay"
          >
            <PhotoCameraOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
        </ButtonBase>
        <Box
          sx={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            bgcolor: "#FF7B92",
            color: "#fff",
            border: "3px solid #fff",
            boxShadow: "0 10px 24px rgba(255, 123, 146, 0.35)",
            pointerEvents: "none",
          }}
        >
          <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>

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