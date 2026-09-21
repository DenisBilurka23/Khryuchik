"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

import type { OrderItemThumbnailProps, OrderItemThumbnailSize } from "./types";

const sizeStyles: Record<OrderItemThumbnailSize, CSSObject> = {
  sm: { width: 44, height: 58, fontSize: 22 },
  md: { width: 52, height: 68, fontSize: 26 },
};

const Tile = styled("span", {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: OrderItemThumbnailSize }>(({ size }) => ({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "var(--radius-field)",
  background: "var(--color-cream)",
  ...sizeStyles[size],
}));

const imageSx = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
} as const;

export const OrderItemThumbnail = ({
  src,
  alt,
  emoji,
  background,
  size = "sm",
}: OrderItemThumbnailProps) => (
  <Tile size={size} style={background ? { background } : undefined}>
    {src ? <Box component="img" src={src} alt={alt} sx={imageSx} /> : emoji}
  </Tile>
);

export type { OrderItemThumbnailProps, OrderItemThumbnailSize } from "./types";
