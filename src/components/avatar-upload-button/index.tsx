"use client";

import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { Avatar, Box, ButtonBase } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import type { AvatarUploadButtonProps } from "./types";

export const AvatarUploadButton = ({
  imageSrc,
  imageAlt,
  fallbackLabel,
  ariaLabel,
  title,
  size = 84,
  overlayIconSize = 24,
  badgeSize = 30,
  badgeIconSize = 15,
  avatarSx,
  onClickAction,
}: AvatarUploadButtonProps) => {
  const baseAvatarSx: SxProps<Theme> = {
    width: size,
    height: size,
  };
  const resolvedAvatarSx: SxProps<Theme> = Array.isArray(avatarSx)
    ? [baseAvatarSx, ...avatarSx]
    : avatarSx
      ? [baseAvatarSx, avatarSx]
      : baseAvatarSx;

  return (
    <Box sx={{ position: "relative", flexShrink: 0 }}>
      <ButtonBase
        type="button"
        aria-label={ariaLabel}
        title={title}
        onClick={onClickAction}
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
          src={imageSrc ?? undefined}
          alt={imageAlt}
          sx={resolvedAvatarSx}
        >
          {fallbackLabel}
        </Avatar>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(39, 33, 42, 0.34)",
            color: "#fff",
            opacity: imageSrc ? 0 : 1,
            transition: "opacity 160ms ease",
          }}
          className="avatar-upload-overlay"
        >
          <PhotoCameraOutlinedIcon sx={{ fontSize: overlayIconSize }} />
        </Box>
      </ButtonBase>
      <Box
        sx={{
          position: "absolute",
          right: -2,
          bottom: -2,
          width: badgeSize,
          height: badgeSize,
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
        <PhotoCameraOutlinedIcon sx={{ fontSize: badgeIconSize }} />
      </Box>
    </Box>
  );
};

export type { AvatarUploadButtonProps } from "./types";