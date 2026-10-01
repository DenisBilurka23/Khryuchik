"use client";

import { Box, CircularProgress, Fade } from "@mui/material";
import { useContext } from "react";

import { LINK_PENDING_REVEAL_DELAY_MS } from "@/constants/loading";

import { LinkPendingContext } from "../context";

const veilSx = {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--color-card-veil)",
  backdropFilter: "blur(2px)",
} as const;

const badgeSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-card)",
  boxShadow: "var(--shadow-card)",
} as const;

export const LinkPendingOverlay = () => {
  const { pending } = useContext(LinkPendingContext);

  return (
    <Fade
      in={pending}
      unmountOnExit
      style={{
        transitionDelay: pending ? `${LINK_PENDING_REVEAL_DELAY_MS}ms` : "0ms",
      }}
    >
      <Box aria-hidden sx={veilSx}>
        <Box sx={badgeSx}>
          <CircularProgress
            size={26}
            thickness={4.5}
            sx={{ color: "var(--color-action)" }}
          />
        </Box>
      </Box>
    </Fade>
  );
};
