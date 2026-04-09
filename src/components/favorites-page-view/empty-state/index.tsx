import { Button, Paper, Typography } from "@mui/material";
import Link from "next/link";

import type { FavoritesEmptyStateProps } from "./types";

export const FavoritesEmptyState = ({
  authState,
  authCopy,
  guestCopy,
  shopHref,
}: FavoritesEmptyStateProps) => (
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
      {authState ? authCopy.favoritesTitle : guestCopy.listTitle}
    </Typography>
    <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 680 }}>
      {authState ? authCopy.favoritesLead : guestCopy.guestListText}
    </Typography>
    <Link href={shopHref} style={{ textDecoration: "none", display: "inline-flex" }}>
      <Button variant="contained" sx={{ mt: 3 }}>
        {authState ? authCopy.favoritesAddAllToCart : guestCopy.continueAction}
      </Button>
    </Link>
  </Paper>
);

export type { FavoritesEmptyStateProps } from "./types";