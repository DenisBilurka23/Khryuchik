import { Box, Container, Grid } from "@mui/material";

import { BookCard } from "../book-card";
import { SectionHeading } from "../section-heading";
import { getLocalizedPath, getLocalizedProductPath } from "@/utils";
import styles from "./books-section.module.css";
import type { BooksSectionProps } from "./types";

export const BookSection = ({
  locale,
  dictionary,
  books,
}: BooksSectionProps) => {
  return (
    <Box component="section" id="books" className={styles.section}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow={dictionary.booksSection.eyebrow}
          title={dictionary.booksSection.title}
          actionLabel={dictionary.booksSection.actionLabel}
          actionHref={getLocalizedPath(locale, "/shop?category=books")}
        />

        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid key={book.id} size={{ xs: 12, md: 4 }}>
              <BookCard
                book={book}
                detailsHref={getLocalizedProductPath(locale, book.slug)}
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
