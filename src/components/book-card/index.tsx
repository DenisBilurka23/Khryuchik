import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import styles from "./book-card.module.css";
import type { BookCardProps } from "./types";

export const BookCard = ({
  book,
  detailsHref,
  detailsButton,
  buyButton,
}: BookCardProps) => {
  return (
    <Card className={styles.card}>
      <CardContent sx={{ p: 3 }}>
        <Link
          href={detailsHref}
          className={styles.cover}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {book.emoji}
        </Link>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {book.lang}
        </Typography>

        <Link
          href={detailsHref}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <Typography
            variant="h6"
            sx={{
              mt: 1,
              fontWeight: 700,
            }}
          >
            {book.shortTitle ?? book.title}
          </Typography>
        </Link>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.5, lineHeight: 1.7 }}
        >
          {book.shortDescription}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button
            href={detailsHref}
            variant="contained"
            className={styles.detailsButton}
          >
            {detailsButton}
          </Button>
          <Button
            href={detailsHref}
            variant="outlined"
            color="inherit"
            className={styles.buyButton}
          >
            {buyButton}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
