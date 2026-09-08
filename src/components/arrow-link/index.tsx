import { Box } from "@mui/material";
import Link from "next/link";

import type { ArrowLinkProps } from "./types";

export const ArrowLink = ({ href, label, size = "md", sx }: ArrowLinkProps) => {
  const isSmall = size === "sm";

  return (
    <Box
      component="span"
      sx={[{ display: "inline-flex" }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Link href={href}>
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: isSmall ? 14 : 15,
            fontWeight: isSmall ? 500 : 600,
            color: "var(--color-action)",
            "&:hover": { color: "var(--color-action-hover)" },
            "&:hover .arrow": { transform: "translateX(3px)" },
          }}
        >
          {label}
          <Box
            component="span"
            aria-hidden
            className="arrow"
            sx={{ transition: "transform 0.2s ease" }}
          >
            →
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export type { ArrowLinkProps, ArrowLinkSize } from "./types";
