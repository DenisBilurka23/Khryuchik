import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Link from "next/link";

import { formatCurrency } from "../utils";
import type { RelatedProductsProps } from "./types";

export const RelatedProducts = ({
  dictionary,
  labels,
  locale,
  relatedIds,
}: RelatedProductsProps) => {
  const relatedProducts = dictionary.shopSection.items.filter((product) =>
    relatedIds.includes(product.id),
  );

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 42 }, mb: 4 }}>
        {labels.relatedTitle}
      </Typography>

      <Grid container spacing={3}>
        {relatedProducts.map((product) => {
          const href =
            locale === "en"
              ? `/products/${product.id}`
              : `/${locale}/products/${product.id}`;

          return (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Link
                href={href}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        minHeight: 180,
                        borderRadius: "24px",
                        bgcolor: "#FFF8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 72,
                      }}
                    >
                      {product.emoji}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ mt: 3, fontSize: 18, fontWeight: 700 }}
                    >
                      {product.title}
                    </Typography>

                    <Typography
                      sx={{ mt: 1, color: "primary.main", fontWeight: 700 }}
                    >
                      {formatCurrency(product.price, locale)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
