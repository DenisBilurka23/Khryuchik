import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

import type { StoryConnectionCardProps } from "../types";

export const StoryConnectionCard = ({
  product,
  titleTemplate,
  description,
  actionLabel,
}: StoryConnectionCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        p: 4,
        borderRadius: "var(--radius-hero)",
        bgcolor: "var(--color-accent-tint)",
        border: "1px solid var(--color-border)",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "20px",
            bgcolor: product.thumbnailBackgroundColor ?? "var(--color-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          {product.emoji ? (
            <span>{product.emoji}</span>
          ) : (
            <AutoStoriesOutlinedIcon />
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
            {titleTemplate}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
            {description}
          </Typography>
        </Box>

        <Link href={product.href}>
          <Button component="span" variant="contained">
            {actionLabel}
          </Button>
        </Link>
      </Stack>
    </Paper>
  );
};
