import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import styles from "./book-card.module.css";
import type { BookCardProps } from "./types";

export const BookCard = ({ book, detailsButton, buyButton }: BookCardProps) => {
  return (
    <Card className={styles.card}>
      <CardContent sx={{ p: 3 }}>
        <Box className={styles.cover}>{book.emoji}</Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {book.lang}
        </Typography>

        <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
          {book.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.5, lineHeight: 1.7 }}
        >
          {book.desc}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button variant="contained" className={styles.detailsButton}>
            {detailsButton}
          </Button>
          <Button
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
