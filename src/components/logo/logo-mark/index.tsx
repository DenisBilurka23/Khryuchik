import { Box } from "@mui/material";
import Image from "next/image";

import logoImage from "@/assets/khryuchik-logo.png";
import { BRAND_LOGO_MARK_SIZE } from "@/constants/brand";

import type { LogoMarkProps } from "../types";

export const LogoMark = ({
  alt = "",
  size = BRAND_LOGO_MARK_SIZE,
  radius = "var(--radius-logo)",
  sizes = "128px",
  priority = false,
  sx,
}: LogoMarkProps) => {
  return (
    <Box
      sx={[
        {
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: radius,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Image
        src={logoImage}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
};
