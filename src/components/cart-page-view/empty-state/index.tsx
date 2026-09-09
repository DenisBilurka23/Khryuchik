import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import cartEmptyImage from "@/assets/CartEmpty.png";

import type { CartEmptyStateProps } from "./types";

const panelSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "0.9fr 1.1fr" },
  alignItems: "center",
  gap: { xs: 3, md: 6 },
  minHeight: { xs: 0, md: 385 },
  p: { xs: "28px 22px", md: "36px 42px" },
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-card)",
  boxShadow: "var(--shadow-floating)",
} as const;

const artSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 0,
} as const;

const artImageStyle = {
  width: "100%",
  maxWidth: 450,
  height: "auto",
  objectFit: "contain",
} as const;

const contentSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: { xs: "center", md: "flex-start" },
  textAlign: { xs: "center", md: "left" },
} as const;

export const CartEmptyState = ({
  title,
  text,
  actionLabel,
  actionHref,
}: CartEmptyStateProps) => {
  return (
    <Box sx={panelSx}>
      <Box sx={artSx}>
        <Image
          src={cartEmptyImage}
          alt={title}
          sizes="(max-width: 900px) 90vw, 450px"
          style={artImageStyle}
        />
      </Box>

      <Box sx={contentSx}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: 26, md: 32 }, lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            maxWidth: 500,
            mt: 2,
            fontSize: 16,
            lineHeight: 1.55,
            color: "var(--color-text-secondary)",
          }}
        >
          {text}
        </Typography>

        <Link href={actionHref}>
          <Button
            component="span"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            {actionLabel}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export type { CartEmptyStateProps } from "./types";
