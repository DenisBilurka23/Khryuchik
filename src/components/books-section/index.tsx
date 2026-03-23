import { Box, Container, Grid } from "@mui/material";

import { BookCard } from "../book-card";
import { SectionHeading } from "../section-heading";
import styles from "./books-section.module.css";
import type { BooksSectionProps } from "./types";

export const BookSection = ({ dictionary }: BooksSectionProps) => {
  return (
    <Box component="section" id="books" className={styles.section}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow={dictionary.booksSection.eyebrow}
          title={dictionary.booksSection.title}
          actionLabel={dictionary.booksSection.actionLabel}
        />

        <Grid container spacing={3}>
          {dictionary.booksSection.items.map((book) => (
            <Grid key={book.title} size={{ xs: 12, md: 4 }}>
              <BookCard
                book={book}
                detailsButton={dictionary.booksSection.detailsButton}
                buyButton={dictionary.booksSection.buyButton}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
