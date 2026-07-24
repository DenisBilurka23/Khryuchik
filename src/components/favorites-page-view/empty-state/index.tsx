import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Box, Button, Paper, Typography } from "@mui/material";
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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 6 },
        borderRadius: "28px",
        border: "1px dashed #E8D6BF",
        bgcolor: "#FFFDFA",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FCE5EA",
          color: "#D06A80",
        }}
      >
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 34 }} />
      </Box>
      <Typography sx={{ mt: 2.5, fontSize: 24, fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 520 }}>
        {text}
      </Typography>
      <Link href={shopHref} style={{ textDecoration: "none", display: "inline-flex" }}>
        <Button variant="contained" size="large" sx={{ mt: 3.5 }}>
          {action}
        </Button>
      </Link>
    </Paper>
  );
};

export type { FavoritesEmptyStateProps } from "./types";
