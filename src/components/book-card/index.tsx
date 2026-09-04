import { Box, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import type { CSSProperties } from "react";

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
      <CardContent className={styles.body}>
        <Link
          href={detailsHref}
          className={styles.cover}
          style={{ "--cover-bg": thumbnail?.bgColor } as CSSProperties}
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
          <Typography component="p" className={styles.lang}>
            {book.lang}
          </Typography>
        ) : null}

        <Link href={detailsHref} className={styles.titleLink}>
          <Typography component="p" className={styles.title}>
            {book.title}
          </Typography>
        </Link>

        <Box className={styles.foot}>
          <ArrowLink href={detailsHref} label={detailsButton} />
        </Box>
      </CardContent>
    </Card>
  );
};
