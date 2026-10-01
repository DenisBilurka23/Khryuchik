import { Box, Container, Grid } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { BookCard } from "@/components/book-card";
import { SectionFooterAction } from "@/components/section-footer-action";
import { SectionHeading } from "@/components/section-heading";
import { getLocalizedPath, getLocalizedProductPath } from "@/utils";
import type { BooksSectionProps } from "./types";

export const BookSection = async ({ locale, books }: BooksSectionProps) => {
  const t = await getTranslations({
    locale,
    namespace: "storefront.booksSection",
  });
  const actionHref = getLocalizedPath(locale, "/shop?category=books");

  return (
    <Box component="section" id="books" sx={{ py: { xs: 1.5, md: 2 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: "24px 20px", md: 4 },
            borderRadius: "var(--radius-panel)",
            background: "var(--color-cream)",
          }}
        >
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            actionLabel={t("actionLabel")}
            actionHref={actionHref}
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

          <SectionFooterAction label={t("actionLabel")} href={actionHref} />
        </Box>
      </Container>
    </Box>
  );
};
