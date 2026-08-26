import { Box } from "@mui/material";
import Image from "next/image";

import {
  BRAND_LOGO_IMAGE_SRC,
  BRAND_LOGO_MARK_RADIUS,
  BRAND_LOGO_MARK_SIZE,
} from "@/constants/brand";

import type { LogoMarkProps } from "../types";

export const LogoMark = ({
  alt = "",
  size = BRAND_LOGO_MARK_SIZE,
  radius = BRAND_LOGO_MARK_RADIUS,
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
        src={BRAND_LOGO_IMAGE_SRC}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
};
