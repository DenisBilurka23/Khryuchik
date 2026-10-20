import { Box } from "@mui/material";
import Link from "next/link";

import { LinkPendingSignal } from "@/components/link-pending";

import type { ArrowLinkProps } from "./types";

const contentSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  color: "var(--color-action)",
  "&:hover": { color: "var(--color-action-hover)" },
} as const;

export const ArrowLink = ({
  href,
  label,
  size = "md",
  onClick,
  download = false,
  sx,
}: ArrowLinkProps) => {
  const isSmall = size === "sm";

  return (
    <Box
      component="span"
      sx={[{ display: "inline-flex" }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Link
        href={href}
        onClick={onClick}
        download={download}
        prefetch={download ? false : undefined}
      >
        {download ? null : <LinkPendingSignal />}
        <Box
          component="span"
          sx={{
            ...contentSx,
            fontSize: isSmall ? 14 : 15,
            fontWeight: isSmall ? 500 : 600,
            "&:hover .arrow": {
              transform: download ? "translateY(3px)" : "translateX(3px)",
            },
          }}
        >
          {label}
          <Box
            component="span"
            aria-hidden
            className="arrow"
            sx={{ transition: "transform 0.2s ease" }}
          >
            {download ? "↓" : "→"}
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export type { ArrowLinkProps, ArrowLinkSize } from "./types";
