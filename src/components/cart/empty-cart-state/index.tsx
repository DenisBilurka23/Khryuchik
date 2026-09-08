import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import type { EmptyCartStateProps } from "../types";

export const EmptyCartState = ({
  title,
  text,
  actionLabel,
  actionHref,
}: EmptyCartStateProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: { xs: "32px 20px", md: "48px 40px" },
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-panel)",
        background: "var(--color-card)",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 80,
          height: 80,
          borderRadius: "var(--radius-card)",
          background: "var(--color-accent-tint)",
          color: "var(--color-accent)",
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Typography
        variant="h2"
        sx={{ mt: 3, fontSize: { xs: 24, md: 30 }, lineHeight: 1.15 }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          maxWidth: "56ch",
          mt: 1.5,
          fontSize: 16,
          lineHeight: 1.65,
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
          sx={{ mt: 3.5 }}
        >
          {actionLabel}
        </Button>
      </Link>
    </Box>
  );
};
