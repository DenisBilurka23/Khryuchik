import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

import styles from "./favorites-empty-state.module.css";
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
    <Paper elevation={0} className={styles.panel}>
      <Box className={styles.icon}>
        <FavoriteBorderOutlinedIcon className={styles.iconGlyph} />
      </Box>

      <Typography variant="h3" className={styles.title}>
        {title}
      </Typography>

      <Typography className={styles.text}>{text}</Typography>

      <Link href={shopHref}>
        <Button
          component="span"
          variant="contained"
          size="large"
          className={styles.action}
        >
          {action}
        </Button>
      </Link>
    </Paper>
  );
};

export type { FavoritesEmptyStateProps } from "./types";
