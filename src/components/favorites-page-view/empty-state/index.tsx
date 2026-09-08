import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import type { FavoritesEmptyStateProps } from "./types";

export const FavoritesEmptyState = ({
  authState,
  shopHref,
}: FavoritesEmptyStateProps) => {
  const tFavorites = useTranslations("storefront.favoritesPage");
  const tAccount = useTranslations("accountPage");

  const title = authState
    ? tAccount("favoritesEmptyTitle")
    : tFavorites("emptyTitle");
  const text = authState
    ? tAccount("favoritesEmptyText")
    : tFavorites("emptyText");
  const action = authState
    ? tAccount("favoritesEmptyAction")
    : tFavorites("continueAction");

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
          width: 72,
          height: 72,
          borderRadius: "var(--radius-pill)",
          background: "var(--color-accent-tint)",
          color: "var(--color-accent)",
        }}
      >
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        variant="h3"
        sx={{ mt: 2.75, fontSize: { xs: 22, md: 26 }, lineHeight: 1.2 }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          maxWidth: "52ch",
          mt: 1.5,
          fontSize: 16,
          lineHeight: 1.65,
          color: "var(--color-text-secondary)",
        }}
      >
        {text}
      </Typography>

      <Link href={shopHref}>
        <Button
          component="span"
          variant="contained"
          size="large"
          sx={{ mt: 3.5 }}
        >
          {action}
        </Button>
      </Link>
    </Box>
  );
};

export type { FavoritesEmptyStateProps } from "./types";
