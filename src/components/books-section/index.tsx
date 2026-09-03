import { Box, Container, Grid } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { BookCard } from "../book-card";
import { SectionHeading } from "../section-heading";
import { getLocalizedPath, getLocalizedProductPath } from "@/utils";
import styles from "./books-section.module.css";
import type { BooksSectionProps } from "./types";

export const BookSection = async ({
  locale,
  books,
}: BooksSectionProps) => {
  const t = await getTranslations({ locale, namespace: "storefront.booksSection" });

  return (
    <Box component="section" id="books" className={styles.section}>
      <Container maxWidth="lg">
        <Box className={styles.panel}>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            actionLabel={t("actionLabel")}
            actionHref={getLocalizedPath(locale, "/shop?category=books")}
          />

          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid key={book.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <BookCard
                  book={book}
                  detailsHref={getLocalizedProductPath(locale, book.slug)}
                  detailsButton={t("detailsButton")}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
