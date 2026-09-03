import { Box, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";

import { ArrowLink } from "../arrow-link";

import styles from "./book-card.module.css";
import type { BookCardProps } from "./types";

export const BookCard = ({
  book,
  detailsHref,
  detailsButton,
}: BookCardProps) => {
  const thumbnail = book.thumbnail;

  return (
    <Card className={styles.card}>
      <CardContent
        sx={{
          p: 1.5,
          "&:last-child": { pb: 1.5 },
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Link
          href={detailsHref}
          className={styles.cover}
          style={{
            textDecoration: "none",
            color: "inherit",
            backgroundColor: thumbnail?.bgColor ?? undefined,
          }}
        >
          {thumbnail?.src ? (
            <Box
              component="img"
              src={thumbnail.src}
              alt={thumbnail.alt ?? book.title}
              className={styles.coverImage}
            />
          ) : (
            (thumbnail?.emoji ?? book.emoji)
          )}
        </Link>

        {book.lang ? (
          <Typography
            sx={{
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "var(--color-text-muted)",
            }}
          >
            {book.lang}
          </Typography>
        ) : null}

        <Link
          href={detailsHref}
          style={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          <Typography
            sx={{ mt: 0.5, fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}
          >
            {book.title}
          </Typography>
        </Link>

        <Box sx={{ mt: "auto", pt: 1.5 }}>
          <ArrowLink href={detailsHref} label={detailsButton} />
        </Box>
      </CardContent>
    </Card>
  );
};
