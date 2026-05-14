"use client";

import { useRef } from "react";
import { Stack, Typography } from "@mui/material";

import { AvatarUploadButton } from "@/components/avatar-upload-button";

import type { AccountAvatarUploadFieldProps } from "./types";

export const AccountAvatarUploadField = ({
  imageSrc,
  imageAlt,
  fallbackLabel,
  changeLabel,
  replaceLabel,
  emptyLabel,
  onFileSelectAction,
  onRequestEditAction,
}: AccountAvatarUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Stack alignItems="center" spacing={1.25}>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onClick={(event) => {
          event.currentTarget.value = "";
        }}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          onRequestEditAction?.();
          onFileSelectAction(file);
        }}
      />

      <AvatarUploadButton
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        fallbackLabel={fallbackLabel}
        ariaLabel={imageSrc ? replaceLabel : changeLabel}
        avatarSx={{
          bgcolor: "#FCE5EA",
          color: "#27272A",
          fontSize: 30,
        }}
        onClickAction={() => {
          inputRef.current?.click();
        }}
      />

      {!imageSrc ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ maxWidth: 180, textAlign: "center" }}
        >
          {changeLabel}. {emptyLabel}
        </Typography>
      ) : null}
    </Stack>
  );
};

export type { AccountAvatarUploadFieldProps } from "./types";