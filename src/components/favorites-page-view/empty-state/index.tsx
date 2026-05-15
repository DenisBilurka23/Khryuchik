import { Button, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import type { FavoritesEmptyStateProps } from "./types";

export const FavoritesEmptyState = ({
  authState,
  shopHref,
}: FavoritesEmptyStateProps) => {
  const tFavorites = useTranslations("storefront.favoritesPage");
  const tAccount = useTranslations("accountPage");

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "28px",
        border: "1px solid #F0DFC8",
        bgcolor: "#fff",
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
        {authState ? tAccount("favoritesTitle") : tFavorites("listTitle")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
        {authState ? tAccount("favoritesLead") : tFavorites("guestListText")}
      </Typography>
      <Link href={shopHref} style={{ textDecoration: "none", display: "inline-flex" }}>
        <Button variant="contained" sx={{ mt: 3 }}>
          {authState ? tAccount("favoritesAddAllToCart") : tFavorites("continueAction")}
        </Button>
      </Link>
    </Paper>
  );
};

export type { FavoritesEmptyStateProps } from "./types";