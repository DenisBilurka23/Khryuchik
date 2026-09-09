import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import emptyImage from "@/assets/FavoriteEmpty.png";

import type { FavoritesEmptyStateProps } from "./types";

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
  boxShadow: "var(--shadow-panel)",
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
} as const;

const contentSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: { xs: "center", md: "flex-start" },
  textAlign: { xs: "center", md: "left" },
} as const;

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
    : tFavorites("emptyAction");

  return (
    <Box sx={panelSx}>
      <Box sx={artSx}>
        <Image
          src={emptyImage}
          alt={title}
          sizes="(max-width: 900px) 90vw, 450px"
          style={artImageStyle}
        />
      </Box>

      <Box sx={contentSx}>
        <Typography
          variant="h3"
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

        <Link href={shopHref}>
          <Button
            component="span"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            {action}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export type { FavoritesEmptyStateProps } from "./types";
