import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Box, Button, Paper, Typography } from "@mui/material";
import Link from "next/link";

import type { EmptyCartStateProps } from "../types";

export const EmptyCartState = ({
  title,
  text,
  actionLabel,
  actionHref,
}: EmptyCartStateProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "32px",
        border: "1px dashed #E8D6BF",
        bgcolor: "#fff",
        p: { xs: 4, md: 6 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: "28px",
          bgcolor: "#FCE5EA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 40 }} />
      </Box>

      <Typography sx={{ mt: 3, fontSize: { xs: 28, md: 36 }, fontWeight: 800 }}>
        {title}
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 560, mx: "auto", lineHeight: 1.8 }}>
        {text}
      </Typography>

      <Link href={actionHref} style={{ textDecoration: "none", color: "inherit" }}>
        <Button component="span" variant="contained" size="large" sx={{ mt: 4 }}>
          {actionLabel}
        </Button>
      </Link>
    </Paper>
  );
};