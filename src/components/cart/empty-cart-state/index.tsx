import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Box, Button, Paper, Typography } from "@mui/material";
import Link from "next/link";

import type { EmptyCartStateProps } from "../types";

import styles from "./empty-cart-state.module.css";

export const EmptyCartState = ({
  title,
  text,
  actionLabel,
  actionHref,
}: EmptyCartStateProps) => {
  return (
    <Paper elevation={0} className={styles.panel}>
      <Box className={styles.icon}>
        <ShoppingBagOutlinedIcon className={styles.iconGlyph} />
      </Box>

      <Typography variant="h2" className={styles.title}>
        {title}
      </Typography>

      <Typography className={styles.text}>{text}</Typography>

      <Link href={actionHref}>
        <Button
          component="span"
          variant="contained"
          size="large"
          className={styles.action}
        >
          {actionLabel}
        </Button>
      </Link>
    </Paper>
  );
};
