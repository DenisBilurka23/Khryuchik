"use client";

import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";
import Image from "next/image";

import type { OrderItemThumbnailProps, OrderItemThumbnailSize } from "./types";

const sizeStyles: Record<OrderItemThumbnailSize, CSSObject> = {
  sm: { width: 44, height: 58, fontSize: 22 },
  md: { width: 52, height: 68, fontSize: 26 },
};

const imageSizes: Record<OrderItemThumbnailSize, string> = {
  sm: "44px",
  md: "52px",
};

const Tile = styled("span", {
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: OrderItemThumbnailSize }>(({ size }) => ({
  position: "relative",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  overflow: "hidden",
  borderRadius: "var(--radius-field)",
  background: "var(--color-cream)",
  ...sizeStyles[size],
}));

export const OrderItemThumbnail = ({
  src,
  alt,
  emoji,
  background,
  size = "sm",
}: OrderItemThumbnailProps) => (
  <Tile size={size} style={background ? { background } : undefined}>
    {src ? (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={imageSizes[size]}
        style={{ objectFit: "contain" }}
      />
    ) : (
      emoji
    )}
  </Tile>
);

export type { OrderItemThumbnailProps, OrderItemThumbnailSize } from "./types";
