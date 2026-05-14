import type { SxProps, Theme } from "@mui/material/styles";

export type AvatarUploadButtonProps = {
  imageSrc?: string | null;
  imageAlt: string;
  fallbackLabel?: string;
  ariaLabel: string;
  title?: string;
  size?: number;
  overlayIconSize?: number;
  badgeSize?: number;
  badgeIconSize?: number;
  avatarSx?: SxProps<Theme>;
  onClickAction: () => void;
};